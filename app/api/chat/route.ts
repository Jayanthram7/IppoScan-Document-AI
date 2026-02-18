
import { NextRequest } from 'next/server';
import { generateEmbedding } from '@/lib/gemini/embeddings';
import { generateRAGResponse } from '@/lib/gemini/text';
import { vectorSimilaritySearch } from '@/lib/db/models';
import { getInvoicesCollection, getTransactionsCollection, getInventoryCollection } from '@/lib/db/models';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const userMessage = messages[messages.length - 1]?.content;

    if (!userMessage) {
      return new Response('No message provided', { status: 400 });
    }

    // Generate query embedding
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(userMessage);

    // Perform vector search on invoices and transactions
    const invoiceResults = await vectorSimilaritySearch(
      queryEmbedding,
      'invoices',
      3
    );
    const transactionResults = await vectorSimilaritySearch(
      queryEmbedding,
      'transactions',
      3
    );

    // Fetch full documents
    // Fetch full documents
    const invoicesCollection = await getInvoicesCollection();
    const transactionsCollection = await getTransactionsCollection();
    const inventoryCollection = await getInventoryCollection();


    const contextParts: string[] = [];

    // --- NEW: Add Inventory Context ---
    // Fetch all inventory items for now (assuming reasonable size). 
    // If it grows, we should implement vector search for inventory too.
    const inventoryItems = await inventoryCollection.find({}).toArray();

    if (inventoryItems.length > 0) {
      const inventoryContext = inventoryItems.map(item =>
        `Item: ${item.item_name}, Quantity: ${item.quantity}`
      ).join('\n');

      contextParts.push("Current Inventory/Stock Levels:\n" + inventoryContext);
    } else {
      contextParts.push("Current Inventory/Stock Levels: No items in stock.");
    }
    // ----------------------------------

    // Add invoice context
    for (const result of invoiceResults) {
      const invoice = await invoicesCollection.findOne({ _id: result._id });
      if (invoice) {
        contextParts.push(
          `Invoice ${invoice.invoice_number} from ${invoice.supplier_name} dated ${invoice.invoice_date}: ` +
          `Total: ${invoice.structured_data.grand_total}, ` +
          `Items: ${invoice.structured_data.items?.map((i: any) => `${i.item_name} (${i.quantity})`).join(', ') || 'None'}, ` +
          `Status: ${invoice.validation_status}`
        );
      }
    }

    // Add transaction context
    for (const result of transactionResults) {
      const transaction = await transactionsCollection.findOne({ _id: result._id });
      if (transaction) {
        contextParts.push(
          `Transaction: ${transaction.type}, Amount: ${transaction.amount}, Date: ${transaction.date}, ` +
          `Invoice ID: ${transaction.invoice_id}`
        );
      }
    }

    const context = contextParts.length > 0
      ? contextParts.join('\n\n')
      : 'No relevant data found in the database.';

    // Generate RAG response using Gemini
    const prompt = `Answer the user's question using ONLY the provided database context.
Summarize clearly and accurately.
If the user asks about stock or inventory quantities, check the "Current Inventory/Stock Levels" section carefully.
If data is missing, say so explicitly.
Be concise but complete in your answer.

Context from database:
${context}

User question: ${userMessage}

Provide a clear, structured answer based on the context above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Split response into chunks for streaming
        const chunks = text.match(/.{1,50}/g) || [text];
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'text-delta', textDelta: chunk })}\n\n`));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(`Chat failed: ${error.message}`, { status: 500 });
  }
}
