import { GoogleGenerativeAI } from '@google/generative-ai';
import { ValidationResult, ValidationIssue } from '@/types/invoice';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use gemini-2.5-flash for better performance and accuracy
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const VALIDATION_PROMPT = `Analyze this invoice data for errors, anomalies, or fraud.
Check for:
- Missing required fields (invoice_number, date, supplier, totals)
- Duplicate invoice numbers
- Mismatched totals (subtotal + tax should equal grand_total)
- Suspicious quantities or prices
- Inconsistent date formats
- Missing or incomplete line items

Return ONLY valid JSON in this format:
{
  "status": "Valid" | "Needs Review" | "Potential Fraud",
  "issues": [
    {
      "field": "field_name (optional)",
      "message": "Description of the issue",
      "severity": "error" | "warning" | "info"
    }
  ]
}

Return ONLY the JSON object, no additional text.`;

const RAG_PROMPT = `Answer the user's question using ONLY the provided database context.
Summarize clearly and accurately.
If data is missing, say so explicitly.
Be concise but complete in your answer.

Context from database:
{CONTEXT}

User question: {QUERY}

Provide a clear, structured answer based on the context above.`;

export async function validateInvoice(invoiceData: any): Promise<ValidationResult> {
  try {
    const invoiceJson = JSON.stringify(invoiceData, null, 2);

    // Try to use Gemini API, but fallback to basic validation if it fails
    try {
      const result = await model.generateContent([
        VALIDATION_PROMPT,
        `Invoice data:\n${invoiceJson}`,
      ]);

      const response = await result.response;
      const text = response.text().trim();

      // Extract JSON from response
      let jsonText = text;
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      const validationResult: ValidationResult = JSON.parse(jsonText);
      return validationResult;
    } catch (geminiError: any) {
      console.log('Gemini validation unavailable, using basic validation');
      // Fallback to basic validation
      return performBasicValidation(invoiceData);
    }
  } catch (error: any) {
    console.error('Error validating invoice:', error);
    // Return a default validation result on error
    return performBasicValidation(invoiceData);
  }
}

function performBasicValidation(invoiceData: any): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Check for missing required fields
  if (!invoiceData.invoice_number || invoiceData.invoice_number.trim() === '') {
    issues.push({
      field: 'invoice_number',
      message: 'Invoice number is missing',
      severity: 'error',
    });
  }

  if (!invoiceData.supplier_name || invoiceData.supplier_name.trim() === '') {
    issues.push({
      field: 'supplier_name',
      message: 'Supplier name is missing',
      severity: 'warning',
    });
  }

  if (!invoiceData.grand_total || invoiceData.grand_total.trim() === '') {
    issues.push({
      field: 'grand_total',
      message: 'Grand total is missing',
      severity: 'error',
    });
  }

  // Check totals match
  const subtotal = parseFloat(invoiceData.subtotal || '0');
  const tax = parseFloat(invoiceData.tax || '0');
  const grandTotal = parseFloat(invoiceData.grand_total || '0');
  const calculatedTotal = subtotal + tax;

  if (grandTotal > 0 && Math.abs(calculatedTotal - grandTotal) > 0.01) {
    issues.push({
      field: 'totals',
      message: `Totals mismatch: subtotal (${subtotal}) + tax (${tax}) = ${calculatedTotal}, but grand total is ${grandTotal}`,
      severity: 'warning',
    });
  }

  // Check if items exist
  if (!invoiceData.items || invoiceData.items.length === 0) {
    issues.push({
      field: 'items',
      message: 'No line items found',
      severity: 'warning',
    });
  }

  const status = issues.some(i => i.severity === 'error')
    ? 'Needs Review'
    : issues.length > 0
      ? 'Needs Review'
      : 'Valid';

  return {
    status,
    issues,
  };
}

export async function generateRAGResponse(
  query: string,
  context: string[]
): Promise<string> {
  try {
    const contextText = context.join('\n\n---\n\n');
    const prompt = RAG_PROMPT
      .replace('{CONTEXT}', contextText)
      .replace('{QUERY}', query);

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error: any) {
    console.error('Error generating RAG response:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

