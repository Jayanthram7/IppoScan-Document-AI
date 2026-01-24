import { NextResponse } from 'next/server';
import { getInvoicesCollection } from '@/lib/db/models';

export async function GET() {
    try {
        const invoicesCollection = await getInvoicesCollection();

        // Get all sales invoices (Delivered status in inventory)
        const salesInvoices = await invoicesCollection
            .find({ inventory_status: 'Delivered' })
            .toArray();

        console.log('Total sales invoices found:', salesInvoices.length);
        console.log('Sample invoice:', salesInvoices[0]);

        // Calculate unique customers (unique supplier names from sales invoices)
        const uniqueCustomers = new Set(
            salesInvoices.map((invoice: any) => invoice.supplier_name).filter(Boolean)
        );
        const totalCustomers = uniqueCustomers.size;

        console.log('Unique customers:', totalCustomers);

        // Calculate total lifetime value (sum of all grand totals from structured_data)
        const lifetimeValue = salesInvoices.reduce((sum: number, invoice: any) => {
            const grandTotal = parseFloat(invoice.structured_data?.grand_total || '0');
            return sum + grandTotal;
        }, 0);

        console.log('Total lifetime value:', lifetimeValue);

        // Build customer list with aggregated data
        const customerMap = new Map();
        salesInvoices.forEach((invoice: any) => {
            const supplierName = invoice.supplier_name;
            if (!supplierName) return;

            if (!customerMap.has(supplierName)) {
                customerMap.set(supplierName, {
                    name: supplierName,
                    email: `${supplierName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                    orders: 0,
                    totalSpent: 0,
                    status: 'Active',
                    joined: new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
            }

            const customer = customerMap.get(supplierName);
            customer.orders += 1;
            customer.totalSpent += parseFloat(invoice.structured_data?.grand_total || '0');
        });

        const customers = Array.from(customerMap.values())
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10); // Top 10 customers

        // Fixed values as requested
        const newThisMonth = 3;
        const returningCustomersPercent = 98;

        return NextResponse.json({
            success: true,
            totalCustomers,
            newThisMonth,
            returningCustomersPercent,
            lifetimeValue,
            customers,
        });
    } catch (error) {
        console.error('Error fetching customer data:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch customer data' },
            { status: 500 }
        );
    }
}
