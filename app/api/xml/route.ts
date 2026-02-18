
import { NextRequest, NextResponse } from 'next/server';
import { getXmlConversionsCollection } from '@/lib/db/models';
import { XMLParser } from 'fast-xml-parser';

export async function GET() {
    try {
        const collection = await getXmlConversionsCollection();
        const conversions = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json({ conversions });
    } catch (error) {
        console.error('Error fetching conversions:', error);
        return NextResponse.json({ error: 'Failed to fetch conversions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const xmlContent = await file.text();
        // Configure parser to keep attributes and make it resemble the XML structure
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            textNodeName: "#text"
        });
        const jsonContent = parser.parse(xmlContent);

        const collection = await getXmlConversionsCollection();
        const conversion = {
            fileName: file.name,
            originalXml: xmlContent,
            convertedJson: jsonContent,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await collection.insertOne(conversion);

        return NextResponse.json({
            conversion: { ...conversion, _id: result.insertedId }
        }, { status: 201 });

    } catch (error) {
        console.error('XML Conversion error:', error);
        return NextResponse.json({ error: 'Failed to process XML' }, { status: 500 });
    }
}
