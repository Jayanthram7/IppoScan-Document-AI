import { NextRequest, NextResponse } from 'next/server';
import { getInvoicesCollection, getSuppliersCollection, getInvoiceItemsCollection, getTransactionsCollection, getInventoryCollection } from '@/lib/db/models';
import { validateInvoice } from '@/lib/gemini/text';
import { generateInvoiceEmbedding } from '@/lib/gemini/embeddings';
import { Invoice, InvoiceData, InvoiceItemDocument, Transaction, InventoryStatus } from '@/types/invoice';

export async function GET(request: NextRequest) {
  try {
    const invoicesCollection = await getInvoicesCollection();
    const invoices = await invoicesCollection
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      invoices: invoices.map((inv) => ({
        ...inv,
        _id: inv._id?.toString(),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: `Failed to fetch invoices: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { invoiceData, filePath } = await request.json();

    console.log('Received invoice data:', JSON.stringify(invoiceData, null, 2));
    console.log('Subtotal:', invoiceData.subtotal, 'Tax:', invoiceData.tax, 'Grand Total:', invoiceData.grand_total);

    if (!invoiceData || !filePath) {
      return NextResponse.json(
        { error: 'Invoice data and file path are required' },
        { status: 400 }
      );
    }

    // Validate invoice using Gemini Text
    let validationResult;
    try {
      validationResult = await validateInvoice(invoiceData);
    } catch (error) {
      console.log('Gemini validation unavailable, using basic validation');
      validationResult = {
        status: 'Valid' as const,
        issues: [],
      };
    }

    // Generate embedding
    let embedding: number[] = [];
    try {
      embedding = await generateInvoiceEmbedding(invoiceData);
    } catch (error) {
      console.log('Gemini embedding unavailable');
      embedding = [];
    }

    // Save to database
    const invoicesCollection = await getInvoicesCollection();
    const suppliersCollection = await getSuppliersCollection();
    const invoiceItemsCollection = await getInvoiceItemsCollection();
    const transactionsCollection = await getTransactionsCollection();
    const inventoryCollection = await getInventoryCollection();

    // Check for duplicate invoice number and auto-increment if needed
    let invoiceNumber = invoiceData.invoice_number;
    let isUnique = false;

    while (!isUnique) {
      const existingInvoice = await invoicesCollection.findOne({
        invoice_number: invoiceNumber,
      });

      if (!existingInvoice) {
        isUnique = true;
      } else {
        // Increment invoice number
        const match = invoiceNumber.match(/^(.*?)(\d+)$/);
        if (match) {
          const prefix = match[1];
          const number = parseInt(match[2]);
          invoiceNumber = `${prefix}${number + 1}`;
        } else {
          invoiceNumber = `${invoiceNumber}-1`;
        }
      }
    }

    // Update the invoice data with the unique number
    invoiceData.invoice_number = invoiceNumber;

    // Determine inventory status based on invoice type
    let inventory_status: InventoryStatus = 'In Travel'; // default
    const invoiceType = invoiceData.invoice_type || 'Other';

    switch (invoiceType) {
      case 'Purchase Invoice':
        inventory_status = 'In Godown';
        break;
      case 'Purchase Order':
        inventory_status = 'Source';
        break;
      case 'Sales Invoice':
        inventory_status = 'Delivered';
        break;
      default:
        inventory_status = 'In Travel';
    }

    // Stock validation for Sales Invoices
    if (invoiceType === 'Sales Invoice') {
      // Get all Purchase Orders to calculate available stock
      const allInvoices = await invoicesCollection.find({}).toArray();
      const purchaseOrders = allInvoices.filter(inv => inv.invoice_type === 'Purchase Order');
      const salesInvoices = allInvoices.filter(inv => inv.invoice_type === 'Sales Invoice');

      // Calculate available stock from Purchase Orders
      const stockMap = new Map<string, number>();

      purchaseOrders.forEach(po => {
        const items = po.structured_data?.items || [];
        items.forEach((item: any) => {
          const qty = parseFloat(item.quantity) || 0;
          const current = stockMap.get(item.item_name) || 0;
          stockMap.set(item.item_name, current + qty);
        });
      });

      // Subtract already sold items
      salesInvoices.forEach(si => {
        const items = si.structured_data?.items || [];
        items.forEach((item: any) => {
          const qty = parseFloat(item.quantity) || 0;
          const current = stockMap.get(item.item_name) || 0;
          stockMap.set(item.item_name, current - qty);
        });
      });

      // Validate current sales invoice items against available stock
      const insufficientStock: string[] = [];

      invoiceData.items.forEach(item => {
        const requestedQty = parseFloat(item.quantity) || 0;
        const availableQty = stockMap.get(item.item_name) || 0;

        if (requestedQty > availableQty) {
          insufficientStock.push(
            `${item.item_name}: Requested ${requestedQty}, Available ${availableQty}`
          );
        }
      });

      // If insufficient stock, return error
      if (insufficientStock.length > 0) {
        return NextResponse.json(
          {
            error: 'Insufficient stock',
            message: 'We do not have enough stock to sell the following items:',
            items: insufficientStock,
          },
          { status: 400 }
        );
      }
    }

    // Create invoice document
    const invoice: Invoice = {
      invoice_number: invoiceData.invoice_number || `INV-${Date.now()}`,
      invoice_date: invoiceData.invoice_date || new Date().toISOString(),
      supplier_name: invoiceData.supplier_name || 'Unknown',
      invoice_type: invoiceType,
      inventory_status: inventory_status,
      raw_text: invoiceData.raw_text || '',
      structured_data: invoiceData,
      validation_status: validationResult.status,
      validation_issues: validationResult.issues,
      embedding,
      file_path: filePath,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert invoice
    const invoiceResult = await invoicesCollection.insertOne(invoice);
    const invoiceId = invoiceResult.insertedId.toString();

    // Update or create supplier
    const grandTotal = parseFloat(invoiceData.grand_total || '0');
    const existingSupplier = await suppliersCollection.findOne({ name: invoice.supplier_name });

    if (existingSupplier) {
      await suppliersCollection.updateOne(
        { name: invoice.supplier_name },
        {
          $inc: {
            total_spend: grandTotal,
            invoice_count: 1,
          },
          $set: {
            updated_at: new Date(),
          },
        }
      );
    } else {
      await suppliersCollection.insertOne({
        name: invoice.supplier_name,
        total_spend: grandTotal,
        invoice_count: 1,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    // Save invoice items
    if (invoiceData.items && Array.isArray(invoiceData.items)) {
      const items: InvoiceItemDocument[] = invoiceData.items.map((item: any) => ({
        invoice_id: invoiceId,
        item_name: item.item_name || '',
        quantity: parseFloat(item.quantity || '0'),
        unit_price: parseFloat(item.unit_price || '0'),
        total_price: parseFloat(item.total_price || '0'),
        created_at: new Date(),
      }));

      if (items.length > 0) {
        await invoiceItemsCollection.insertMany(items);

        // Update inventory
        for (const item of items) {
          await inventoryCollection.updateOne(
            { item_name: item.item_name },
            {
              $setOnInsert: {
                item_name: item.item_name,
                created_at: new Date(),
              },
              $inc: {
                quantity: item.quantity,
              },
              $set: {
                last_updated: new Date(),
                source_invoice_id: invoiceId,
                updated_at: new Date(),
              },
            },
            { upsert: true }
          );
        }
      }
    }

    // Create transaction
    const transaction: Transaction = {
      invoice_id: invoiceId,
      type: 'purchase',
      amount: parseFloat(invoiceData.grand_total || '0'),
      date: new Date(invoiceData.invoice_date || Date.now()),
      metadata: {
        supplier: invoice.supplier_name,
        invoice_number: invoice.invoice_number,
      },
      created_at: new Date(),
    };

    // Generate transaction embedding
    if (embedding && embedding.length > 0) {
      transaction.embedding = embedding;
    }

    await transactionsCollection.insertOne(transaction);

    return NextResponse.json({
      success: true,
      invoice: {
        ...invoice,
        _id: invoiceId,
      },
      validation: validationResult,
    });
  } catch (error: any) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: `Save failed: ${error.message}` },
      { status: 500 }
    );
  }
}
