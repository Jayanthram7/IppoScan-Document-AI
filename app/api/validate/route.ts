import { NextRequest, NextResponse } from 'next/server';
import { validateInvoice } from '@/lib/gemini/text';
import { getInvoicesCollection } from '@/lib/db/models';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { invoiceId } = await request.json();

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoicesCollection = await getInvoicesCollection();
    const invoice = await invoicesCollection.findOne({
      _id: new ObjectId(invoiceId) as any,
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Validate invoice
    const validationResult = await validateInvoice(invoice.structured_data);

    // Update invoice with validation results
    await invoicesCollection.updateOne(
      { _id: new ObjectId(invoiceId) as any },
      {
        $set: {
          validation_status: validationResult.status,
          validation_issues: validationResult.issues,
          updated_at: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      validation: validationResult,
    });
  } catch (error: any) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: `Validation failed: ${error.message}` },
      { status: 500 }
    );
  }
}

