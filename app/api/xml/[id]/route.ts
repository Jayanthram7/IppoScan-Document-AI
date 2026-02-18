
import { NextRequest, NextResponse } from 'next/server';
import { getXmlConversionsCollection } from '@/lib/db/models';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const collection = await getXmlConversionsCollection();
        // Cast to any to avoid type mismatch between ObjectId and string in generic Collection<T>
        const conversion = await collection.findOne({ _id: new ObjectId(params.id) } as any);

        if (!conversion) {
            return NextResponse.json({ error: 'Conversion not found' }, { status: 404 });
        }

        return NextResponse.json({ conversion });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch conversion' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { convertedJson } = body;

        const collection = await getXmlConversionsCollection();
        await collection.updateOne(
            { _id: new ObjectId(params.id) } as any,
            {
                $set: {
                    convertedJson,
                    updatedAt: new Date().toISOString()
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update conversion' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const collection = await getXmlConversionsCollection();
        await collection.deleteOne({ _id: new ObjectId(params.id) } as any);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete conversion' }, { status: 500 });
    }
}
