import { NextRequest, NextResponse } from 'next/server';
import { readFile } from '@/lib/storage/fileStorage';
import { extractInvoiceData } from '@/lib/gemini/vision';

export async function POST(request: NextRequest) {
    try {
        const { filePath, mimeType } = await request.json();

        if (!filePath || !mimeType) {
            return NextResponse.json(
                { error: 'File path and MIME type are required' },
                { status: 400 }
            );
        }

        // Read file
        const imageBuffer = await readFile(filePath);

        // Extract invoice data using OCR + Gemini (or fallback to regex)
        const invoiceData = await extractInvoiceData(imageBuffer, mimeType);

        console.log('Extract endpoint - returning data:', JSON.stringify(invoiceData, null, 2));

        return NextResponse.json({
            success: true,
            invoiceData,
        });
    } catch (error: any) {
        console.error('Extraction error:', error);
        return NextResponse.json(
            { error: `Extraction failed: ${error.message}` },
            { status: 500 }
        );
    }
}
