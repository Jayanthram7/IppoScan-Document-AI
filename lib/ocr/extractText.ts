import { recognize } from 'node-tesseract-ocr';
import sharp from 'sharp';
import pdfParse from 'pdf-parse';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Extract text from image or PDF using OCR (node-tesseract-ocr) or PDF parsing
 */
export async function extractTextFromImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
  let tempFilePath: string | null = null;

  try {
    // Handle PDF files - try to extract text directly first
    if (mimeType === 'application/pdf') {
      try {
        // Try to extract text directly from PDF (works for text-based PDFs)
        const pdfData = await pdfParse(imageBuffer);
        if (pdfData.text && pdfData.text.trim().length > 0) {
          console.log('Extracted text directly from PDF');
          return pdfData.text.trim();
        }
      } catch (pdfError) {
        console.log('Direct PDF text extraction failed, will use OCR');
      }

      // If direct extraction fails, convert PDF first page to image and use OCR
      // Note: This is a simplified approach - for multi-page PDFs, you'd need pdf2pic
      throw new Error('PDF OCR requires converting PDF to image first. Please use an image file (PNG/JPG) or convert the PDF to an image.');
    }

    // Preprocess image for better OCR results
    // Convert to grayscale and enhance contrast
    let processedBuffer = await sharp(imageBuffer)
      .greyscale()
      .normalize()
      .sharpen()
      .toBuffer();

    // Save to temporary file (node-tesseract-ocr requires file path)
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `ocr-${Date.now()}.png`);
    await fs.writeFile(tempFilePath, processedBuffer);

    // Perform OCR using node-tesseract-ocr
    console.log('Starting OCR recognition...');
    const text = await recognize(tempFilePath, {
      lang: 'eng',
      oem: 1,
      psm: 6, // Assume a single uniform block of text
    });

    // Clean up temp file
    if (tempFilePath) {
      await fs.remove(tempFilePath);
      tempFilePath = null;
    }

    if (!text || text.trim().length === 0) {
      throw new Error('No text could be extracted from the image. Please ensure the image is clear and readable.');
    }

    console.log(`OCR extracted ${text.length} characters`);
    return text.trim();
  } catch (error: any) {
    // Clean up temp file if it exists
    if (tempFilePath) {
      try {
        await fs.remove(tempFilePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    console.error('OCR Error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

/**
 * Extract structured invoice data from OCR text using Gemini Text API
 */
export async function extractInvoiceDataFromText(ocrText: string): Promise<any> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const INVOICE_EXTRACTION_PROMPT = `You are an AI document intelligence system.
Analyze the following OCR-extracted text from an invoice and extract structured data.
Extract invoice details accurately without hallucination.
Return ONLY valid JSON in the following format:

{
  "invoice_number": "",
  "invoice_date": "",
  "supplier_name": "",
  "invoice_type": "",
  "raw_text": "",
  "items": [
    {
      "item_name": "",
      "quantity": "",
      "unit_price": "",
      "total_price": ""
    }
  ],
  "subtotal": "",
  "tax": "",
  "grand_total": "",
  "confidence_notes": ""
}

Important:
- Use the OCR text provided as raw_text
- Extract all fields from the OCR text
- For invoice_type, determine if this is a "Purchase Invoice", "Purchase Order", "Sales Invoice", or "Other"
  - Look for keywords like "PURCHASE INVOICE", "PURCHASE ORDER", "SALES INVOICE", "BILL", "RECEIPT"
  - If unclear, use "Other"
- If a field is not found, use empty string ""
- For items array, extract all line items found
- DO NOT include currency symbols ($, €, etc.) in numeric fields
- Return ONLY the JSON object, no additional text or markdown formatting

OCR Text:
${ocrText}`;

  // Try Gemini API first, fallback to regex parsing if it fails
  const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName} for text extraction`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(INVOICE_EXTRACTION_PROMPT);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      let jsonText = text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      const invoiceData = JSON.parse(jsonText);
      // Ensure raw_text is set to the OCR text
      invoiceData.raw_text = ocrText;

      console.log(`Successfully extracted data using model: ${modelName}`);
      console.log('Extracted invoice data:', JSON.stringify(invoiceData, null, 2));
      console.log('Items count:', invoiceData.items?.length || 0);
      console.log('Subtotal:', invoiceData.subtotal, 'Tax:', invoiceData.tax, 'Grand Total:', invoiceData.grand_total);

      return invoiceData;
    } catch (error: any) {
      console.log(`Model ${modelName} failed:`, error.message);
      lastError = error;
      continue;
    }
  }

  // Fallback to regex-based parsing if Gemini API fails
  console.log('Gemini API unavailable, using regex-based parsing');
  const { parseInvoiceFromText } = await import('./parseInvoice');
  const invoiceData = parseInvoiceFromText(ocrText);
  console.log('Successfully extracted data using regex parsing');
  return invoiceData;
}

