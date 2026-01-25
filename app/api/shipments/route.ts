import { NextRequest, NextResponse } from 'next/server';
import { getShipmentsCollection, getInventoryCollection } from '@/lib/db/models';

export async function POST(request: NextRequest) {
    try {
        const shipmentsCollection = await getShipmentsCollection();
        const body = await request.json();

        // Validate required fields
        if (!body.origin || !body.destination || !body.items || body.items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const shipment = {
            ...body,
            status: 'In Transit',
            created_at: new Date(),
            updated_at: new Date(),
        };

        const result = await shipmentsCollection.insertOne(shipment);

        // Update inventory/godown items matching the shipment items
        // This decreases the quantity from the godown inventory
        const inventoryCollection = await getInventoryCollection();

        for (const item of body.items) {
            // Decrease quantity from godown inventory
            await inventoryCollection.updateOne(
                { item_name: item.itemName },
                { $inc: { quantity: -item.quantity }, $set: { updated_at: new Date() } }
            );
        }

        return NextResponse.json({ success: true, shipmentId: result.insertedId }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating shipment:', error);
        return NextResponse.json(
            { error: `Failed to create shipment: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const shipmentsCollection = await getShipmentsCollection();

        const shipments = await shipmentsCollection
            .find({})
            .sort({ created_at: -1 })
            .toArray();

        return NextResponse.json(shipments);
    } catch (error: any) {
        console.error('Error fetching shipments:', error);
        return NextResponse.json(
            { error: `Failed to fetch shipments: ${error.message}` },
            { status: 500 }
        );
    }
}
