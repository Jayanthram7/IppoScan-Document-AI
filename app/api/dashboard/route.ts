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
    // Synthetic data for showcase to ensure "ups and downs"
    // Requirement: Purchases > Sales in 4 months, Sales > Purchases in 8 months
    // High variance for "jagged" look
    const monthlyData = [
      { month: 'Apr', sales: 24500, purchases: 12000 },  // 1. S > P (Start strong)
      { month: 'May', sales: 29000, purchases: 31000 },  // 1. P > S (Stock up)
      { month: 'Jun', sales: 15000, purchases: 38000 },  // 2. P > S (Major dip in sales, high purchase)
      { month: 'Jul', sales: 42000, purchases: 18000 },  // 2. S > P (Big recovery)
      { month: 'Aug', sales: 38000, purchases: 41000 },  // 3. P > S (Pre-season stock)
      { month: 'Sep', sales: 45000, purchases: 22000 },  // 3. S > P (Season start)
      { month: 'Oct', sales: 28000, purchases: 15000 },  // 4. S > P (Dip)
      { month: 'Nov', sales: 52000, purchases: 35000 },  // 5. S > P (Peak)
      { month: 'Dec', sales: 24000, purchases: 29000 },  // 4. P > S (End year stock)
      { month: 'Jan', sales: 22500, purchases: 21000 },  // 6. S > P (Close call, slight profit)
      { month: 'Feb', sales: 39000, purchases: 16000 },  // 7. S > P (Strong month)
      { month: 'Mar', sales: 48000, purchases: 26000 },  // 8. S > P (Fiscal year end push)
    ];

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

