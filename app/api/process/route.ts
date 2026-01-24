import { NextRequest, NextResponse } from 'next/server';
import { readFile } from '@/lib/storage/fileStorage';
import { extractInvoiceData } from '@/lib/gemini/vision';
import { validateInvoice } from '@/lib/gemini/text';
import { generateInvoiceEmbedding } from '@/lib/gemini/embeddings';
import {
  getInvoicesCollection,
  getSuppliersCollection,
  getInvoiceItemsCollection,
  getTransactionsCollection,
  getInventoryCollection,
} from '@/lib/db/models';
import { Invoice, InvoiceItemDocument, Transaction, InventoryItem } from '@/types/invoice';

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

    // Extract invoice data using OCR + Gemini Text API
    const invoiceData = await extractInvoiceData(imageBuffer, mimeType);

    // Validate invoice using Gemini Text
    const validationResult = await validateInvoice(invoiceData);

    // Generate embedding
    const embedding = await generateInvoiceEmbedding(invoiceData);

    // Save to database
    const invoicesCollection = await getInvoicesCollection();
    const suppliersCollection = await getSuppliersCollection();
    const invoiceItemsCollection = await getInvoiceItemsCollection();
    const transactionsCollection = await getTransactionsCollection();
    const inventoryCollection = await getInventoryCollection();

    // Check for duplicate invoice number
    // Check for duplicate invoice number and auto-increment if needed
    let invoiceNumber = invoiceData.invoice_number;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existingInvoice = await invoicesCollection.findOne({
        invoice_number: invoiceNumber,
      });

      if (!existingInvoice) {
        isUnique = true;
      } else {
        // Increment invoice number
        // Check if it already ends with a number
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

    // Create invoice document
    const invoice: Invoice = {
      invoice_number: invoiceData.invoice_number || `INV-${Date.now()}`,
      invoice_date: invoiceData.invoice_date || new Date().toISOString(),
      supplier_name: invoiceData.supplier_name || 'Unknown',
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
      // Update existing supplier
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
      // Create new supplier
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
    const transactionEmbedding = await generateInvoiceEmbedding({
      ...invoiceData,
      type: 'transaction',
    });
    transaction.embedding = transactionEmbedding;

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
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: `Processing failed: ${error.message}` },
      { status: 500 }
    );
  }
}

