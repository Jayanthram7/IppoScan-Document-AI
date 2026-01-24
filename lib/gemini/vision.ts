import { extractTextFromImage, extractInvoiceDataFromText } from '@/lib/ocr/extractText';

/**
 * Extract invoice data from image using OCR + Gemini Text API
 * This replaces the Gemini Vision API with OCR for text extraction
 */
export async function extractInvoiceData(imageBuffer: Buffer, mimeType: string): Promise<any> {
  try {
    // Step 1: Extract text using OCR
    console.log('Extracting text using OCR...');
    const ocrText = await extractTextFromImage(imageBuffer, mimeType);
    
    if (!ocrText || ocrText.trim().length === 0) {
      throw new Error('No text could be extracted from the image. Please ensure the image is clear and readable.');
    }
    
    console.log(`OCR extracted ${ocrText.length} characters`);
    
    // Step 2: Extract structured data from OCR text using Gemini Text API
    console.log('Extracting structured data from OCR text...');
    const invoiceData = await extractInvoiceDataFromText(ocrText);
    
    return invoiceData;
  } catch (error: any) {
    console.error('Error extracting invoice data:', error);
    throw new Error(`Failed to extract invoice data: ${error.message}`);
  }
}
