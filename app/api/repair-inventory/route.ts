import { NextResponse } from 'next/server';
import { getInvoicesCollection, getInventoryCollection } from '@/lib/db/models';

export async function GET() {
    try {
        const invoicesCollection = await getInvoicesCollection();
        const inventoryCollection = await getInventoryCollection();

        // 1. Fetch all invoices
        const allInvoices = await invoicesCollection.find({}).toArray();

        // 2. Calculate net stock per item (Purchase - Sales)
        const itemsMap = new Map<string, { quantity: number; unit_price: number; last_updated: Date }>();

        allInvoices.forEach((invoice) => {
            const isSales = invoice.invoice_type === 'Sales Invoice';
            const isPurchase = invoice.invoice_type === 'Purchase Order' || invoice.invoice_type === 'Purchase Invoice';

            // If it's neither (e.g. 'Other' or undefined), we might skip or treat as positive? 
            // Current logic in Godown page only counts Purchase Orders and subtracts Sales Invoices.
            // Let's stick to that: Purchase (Order/Invoice) adds, Sales subtracts.

            const multiplier = isSales ? -1 : (isPurchase ? 1 : 0);

            if (multiplier === 0) return; // Skip unknown types to match Godown logic if possible, or maybe default to 1? 
            // "In Travel" usually means Purchase, right?
            // Let's look at Invoices logic: default is 'In Travel' -> Inventory Status.
            // Safe bet: If not Sales, it's an addition (Purchase).

            const realMultiplier = invoice.invoice_type === 'Sales Invoice' ? -1 : 1;

            const items = invoice.structured_data?.items || [];
            items.forEach((item: any) => {
                const qty = parseFloat(item.quantity) || 0;
                const price = parseFloat(item.unit_price) || 0;

                if (!itemsMap.has(item.item_name)) {
                    itemsMap.set(item.item_name, {
                        quantity: 0,
                        unit_price: price, // valid assumption?
                        last_updated: new Date(0)
                    });
                }

                const current = itemsMap.get(item.item_name)!;
                current.quantity += (qty * realMultiplier);

                // Update price info from latest purchase? 
                if (realMultiplier === 1 && price > 0) {
                    current.unit_price = price;
                }

                const invoiceDate = new Date(invoice.created_at || new Date());
                if (invoiceDate > current.last_updated) {
                    current.last_updated = invoiceDate;
                }
            });
        });

        // 3. Clear existing inventory
        await inventoryCollection.deleteMany({});

        // 4. Insert recalculated items
        const inventoryItems = Array.from(itemsMap.entries()).map(([name, data]) => ({
            item_name: name,
            quantity: data.quantity,
            unit_price: data.unit_price,
            last_updated: data.last_updated,
            created_at: new Date(), // approximations
            updated_at: new Date()
        }));

        if (inventoryItems.length > 0) {
            await inventoryCollection.insertMany(inventoryItems);
        }

        return NextResponse.json({
            success: true,
            message: `Repaired inventory. Processed ${allInvoices.length} invoices. Updated ${inventoryItems.length} items.`,
            items: inventoryItems
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
