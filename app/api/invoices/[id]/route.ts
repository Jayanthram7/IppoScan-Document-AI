import { NextRequest, NextResponse } from 'next/server';
import { getInvoicesCollection, getSuppliersCollection, getInvoiceItemsCollection, getTransactionsCollection, getInventoryCollection } from '@/lib/db/models';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const invoicesCollection = await getInvoicesCollection();
    const invoice = await invoicesCollection.findOne({
      _id: new ObjectId(id) as any,
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice,
        _id: invoice._id?.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: `Failed to fetch invoice: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params;

    if (!invoiceId || !ObjectId.isValid(invoiceId)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const invoicesCollection = await getInvoicesCollection();
    const suppliersCollection = await getSuppliersCollection();
    const invoiceItemsCollection = await getInvoiceItemsCollection();
    const transactionsCollection = await getTransactionsCollection();
    const inventoryCollection = await getInventoryCollection();

    // Get the invoice first to retrieve necessary data
    const invoice = await invoicesCollection.findOne({ _id: new ObjectId(invoiceId) as any });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get invoice items before deletion
    const invoiceItems = await invoiceItemsCollection.find({ invoice_id: invoiceId }).toArray();

    // Update supplier stats (decrement)
    const grandTotal = parseFloat(invoice.structured_data?.grand_total || '0');
    await suppliersCollection.updateOne(
      { name: invoice.supplier_name },
      {
        $inc: {
          total_spend: -grandTotal,
          invoice_count: -1,
        },
        $set: {
          updated_at: new Date(),
        },
      }
    );

    // Update inventory (decrement quantities)
    for (const item of invoiceItems) {
      await inventoryCollection.updateOne(
        { item_name: item.item_name },
        {
          $inc: {
            quantity: -item.quantity,
          },
          $set: {
            last_updated: new Date(),
          },
        }
      );
    }

    // Delete invoice items
    await invoiceItemsCollection.deleteMany({ invoice_id: invoiceId });

    // Delete transactions
    await transactionsCollection.deleteMany({ invoice_id: invoiceId });

    // Delete the invoice
    await invoicesCollection.deleteOne({ _id: new ObjectId(invoiceId) as any });

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: `Failed to delete invoice: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid invoice ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const invoicesCollection = await getInvoicesCollection();

    // Prepare update data
    const updateData: any = {
      invoice_number: body.invoice_number,
      invoice_date: body.invoice_date,
      supplier_name: body.supplier_name,
      structured_data: {
        ...body.structured_data,
        subtotal: body.structured_data.subtotal,
        tax: body.structured_data.tax,
        grand_total: body.structured_data.grand_total,
        items: body.structured_data.items || []
      },
      updated_at: new Date()
    };

    // Update the invoice
    const result = await invoicesCollection.updateOne(
      { _id: new ObjectId(id) as any },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Fetch and return the updated invoice
    const updatedInvoice = await invoicesCollection.findOne({
      _id: new ObjectId(id) as any
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
      invoice: {
        ...updatedInvoice,
        _id: updatedInvoice?._id?.toString()
      }
    });
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: `Failed to update invoice: ${error.message}` },
      { status: 500 }
    );
  }
}
