import { NextResponse } from 'next/server';
import { getInvoicesCollection } from '@/lib/db/models';

export async function GET() {
    try {
        const invoicesCollection = await getInvoicesCollection();

        // Get all purchase orders (Source status in inventory)
        const purchaseOrders = await invoicesCollection
            .find({ inventory_status: 'Source' })
            .toArray();

        console.log('Total purchase orders found:', purchaseOrders.length);
        console.log('Sample purchase order:', purchaseOrders[0]);

        // Calculate unique suppliers (unique supplier names from purchase orders)
        const uniqueSuppliers = new Set(
            purchaseOrders.map((invoice: any) => invoice.supplier_name).filter(Boolean)
        );
        const totalSuppliers = uniqueSuppliers.size;

        console.log('Unique suppliers:', totalSuppliers);

        // Calculate total lifetime value (sum of all grand totals from structured_data)
        const lifetimeValue = purchaseOrders.reduce((sum: number, invoice: any) => {
            const grandTotal = parseFloat(invoice.structured_data?.grand_total || '0');
            return sum + grandTotal;
        }, 0);

        console.log('Total lifetime value:', lifetimeValue);

        // Build supplier list with aggregated data
        const supplierMap = new Map();
        purchaseOrders.forEach((invoice: any) => {
            const supplierName = invoice.supplier_name;
            if (!supplierName) return;

            if (!supplierMap.has(supplierName)) {
                supplierMap.set(supplierName, {
                    name: supplierName,
                    email: `${supplierName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                    orders: 0,
                    totalSpent: 0,
                    status: 'Active',
                    joined: new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
            }

            const supplier = supplierMap.get(supplierName);
            supplier.orders += 1;
            supplier.totalSpent += parseFloat(invoice.structured_data?.grand_total || '0');
        });

        const suppliers = Array.from(supplierMap.values())
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10); // Top 10 suppliers

        // Fixed values as requested
        const newThisMonth = 3;
        const returningPercent = 98;

        return NextResponse.json({
            success: true,
            totalSuppliers,
            newThisMonth,
            returningPercent,
            lifetimeValue,
            suppliers,
        });
    } catch (error) {
        console.error('Error fetching supplier data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch supplier data' },
            { status: 500 }
        );
    }
}
