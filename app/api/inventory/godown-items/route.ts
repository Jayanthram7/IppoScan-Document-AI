import { NextRequest, NextResponse } from 'next/server';
import { getInventoryCollection } from '@/lib/db/models';

export async function GET() {
    try {
        const inventoryCollection = await getInventoryCollection();

        // Fetch items from the dedicated inventory collection where quantity > 0
        const inventoryItems = await inventoryCollection
            .find({ quantity: { $gt: 0 } })
            .project({
                _id: 1,
                item_name: 1,
                quantity: 1,
                // unit_price might not exist, but we project 1 just in case
                unit_price: 1,
            })
            .sort({ item_name: 1 })
            .toArray();

        // Map _id to string just in case
        const items = inventoryItems.map(item => ({
            ...item,
            _id: item._id.toString()
        }));

        return NextResponse.json(items);
    } catch (error: any) {
        console.error('Error fetching godown items:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
