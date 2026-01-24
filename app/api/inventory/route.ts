import { NextRequest, NextResponse } from 'next/server';
import { getInventoryCollection } from '@/lib/db/models';

export async function GET(request: NextRequest) {
    try {
        const inventoryCollection = await getInventoryCollection();

        // Fetch all inventory items, sorted by item name
        const items = await inventoryCollection
            .find({})
            .sort({ item_name: 1 })
            .toArray();

        return NextResponse.json({
            success: true,
            items: items.map(item => ({
                ...item,
                _id: item._id?.toString(),
            })),
        });
    } catch (error: any) {
        console.error('Error fetching inventory:', error);
        return NextResponse.json(
            { error: `Failed to fetch inventory: ${error.message}` },
            { status: 500 }
        );
    }
}
