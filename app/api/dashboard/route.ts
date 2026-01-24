import { NextRequest, NextResponse } from 'next/server';
import {
  getInvoicesCollection,
  getSuppliersCollection,
  getInventoryCollection,
} from '@/lib/db/models';

export async function GET(request: NextRequest) {
  try {
    const invoicesCollection = await getInvoicesCollection();
    const suppliersCollection = await getSuppliersCollection();
    const inventoryCollection = await getInventoryCollection();

    // Total invoices
    const totalInvoices = await invoicesCollection.countDocuments({});

    // Anomalies detected
    const anomaliesDetected = await invoicesCollection.countDocuments({
      validation_status: { $in: ['Needs Review', 'Potential Fraud'] },
    });

    // Supplier spend
    const suppliers = await suppliersCollection
      .find({})
      .sort({ total_spend: -1 })
      .limit(10)
      .toArray();

    const supplierSpend = suppliers.map((s) => ({
      name: s.name,
      total: s.total_spend || 0,
      invoiceCount: s.invoice_count || 0,
    }));

    // Recent inventory updates (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentInventoryUpdates = await inventoryCollection.countDocuments({
      last_updated: { $gte: sevenDaysAgo },
    });

    // Calculate total profit (Sales - Orders)
    const allInvoices = await invoicesCollection.find({}).toArray();
    const purchaseOrders = allInvoices.filter(inv => inv.invoice_type === 'Purchase Order');
    const salesInvoices = allInvoices.filter(inv => inv.invoice_type === 'Sales Invoice');

    const totalOrdersValue = purchaseOrders.reduce((sum, inv) => {
      return sum + (parseFloat(inv.structured_data?.grand_total || '0'));
    }, 0);

    const totalSalesValue = salesInvoices.reduce((sum, inv) => {
      return sum + (parseFloat(inv.structured_data?.grand_total || '0'));
    }, 0);

    const totalProfit = totalSalesValue - totalOrdersValue;

    // Calculate inventory items count (items in godown with positive quantity)
    const itemsMap = new Map<string, number>();

    // Add quantities from Purchase Orders
    purchaseOrders.forEach(po => {
      const items = po.structured_data?.items || [];
      items.forEach((item: any) => {
        const qty = parseFloat(item.quantity) || 0;
        const current = itemsMap.get(item.item_name) || 0;
        itemsMap.set(item.item_name, current + qty);
      });
    });

    // Subtract sold quantities from Sales Invoices
    salesInvoices.forEach(si => {
      const items = si.structured_data?.items || [];
      items.forEach((item: any) => {
        const qty = parseFloat(item.quantity) || 0;
        const current = itemsMap.get(item.item_name) || 0;
        itemsMap.set(item.item_name, current - qty);
      });
    });

    // Count items with positive quantity
    const inventoryItems = Array.from(itemsMap.values()).filter(qty => qty > 0).length;

    // Calculate monthly data (April to March fiscal year)
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const monthlyData = months.map(monthName => {
      const monthIndex = months.indexOf(monthName);
      const monthNum = monthIndex < 9 ? monthIndex + 4 : monthIndex - 8; // Apr=4, May=5, ..., Mar=3

      const purchasesForMonth = purchaseOrders.filter(po => {
        const date = new Date(po.invoice_date);
        return date.getMonth() === (monthNum - 1); // JS months are 0-indexed
      }).reduce((sum, po) => sum + (parseFloat(po.structured_data?.grand_total || '0')), 0);

      const salesForMonth = salesInvoices.filter(si => {
        const date = new Date(si.invoice_date);
        return date.getMonth() === (monthNum - 1);
      }).reduce((sum, si) => sum + (parseFloat(si.structured_data?.grand_total || '0')), 0);

      return {
        month: monthName,
        purchases: purchasesForMonth,
        sales: salesForMonth,
      };
    });

    return NextResponse.json({
      success: true,
      totalInvoices,
      anomaliesDetected,
      supplierSpend,
      recentInventoryUpdates,
      totalProfit,
      inventoryItems,
      monthlyData,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: `Failed to fetch dashboard stats: ${error.message}` },
      { status: 500 }
    );
  }
}

