import { NextResponse } from 'next/server';
import { getInventoryCollection } from '@/lib/db/models';

export async function GET() {
    try {
        const collection = await getInventoryCollection();
        const items = await collection.find({}).toArray();
        return NextResponse.json({
            count: items.length,
            items: items.map(item => ({
                name: item.item_name,
                quantity: item.quantity,
                lastUpdated: item.last_updated
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
