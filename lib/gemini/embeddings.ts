import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use the embedding model - Gemini SDK embedContent takes text directly or array of parts
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await embeddingModel.embedContent(text);

    const embedding = result.embedding.values;

    if (!embedding || embedding.length === 0) {
      throw new Error('Empty embedding returned');
    }

    return Array.from(embedding);
  } catch (error: any) {
    console.error('Error generating embedding:', error);
    // Fallback: return a dummy embedding if API fails (768 dimensions for text-embedding-004)
    console.warn('Using fallback embedding');
    return new Array(768).fill(0).map(() => Math.random() * 0.01);
  }
}

export async function generateInvoiceEmbedding(invoice: any): Promise<number[]> {
  // Create a comprehensive text representation of the invoice
  const textParts = [
    `Invoice Number: ${invoice.invoice_number || ''}`,
    `Date: ${invoice.invoice_date || ''}`,
    `Supplier: ${invoice.supplier_name || ''}`,
    `Total: ${invoice.grand_total || ''}`,
    `Items: ${invoice.items?.map((item: any) =>
      `${item.item_name} (${item.quantity} x ${item.unit_price})`
    ).join(', ') || ''}`,
    `Raw Text: ${invoice.raw_text || ''}`,
  ];

  const text = textParts.join('\n');
  return generateEmbedding(text);
}

export async function generateTransactionEmbedding(transaction: any): Promise<number[]> {
  const textParts = [
    `Transaction Type: ${transaction.type}`,
    `Amount: ${transaction.amount}`,
    `Date: ${transaction.date}`,
    `Invoice ID: ${transaction.invoice_id}`,
    `Metadata: ${JSON.stringify(transaction.metadata || {})}`,
  ];

  const text = textParts.join('\n');
  return generateEmbedding(text);
}

