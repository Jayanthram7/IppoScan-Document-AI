/**
 * Parse invoice data from OCR text using regex patterns
 * This is a fallback when Gemini API is not available
 */
export function parseInvoiceFromText(ocrText: string): any {
  const text = ocrText.toLowerCase();
  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Extract invoice number
  const invoiceNumberMatch = ocrText.match(/(?:invoice|inv|bill|receipt)[\s#:]*([A-Z0-9\-]+)/i) ||
    ocrText.match(/#[\s]*([A-Z0-9\-]+)/i) ||
    ocrText.match(/(?:number|no|#)[\s:]*([A-Z0-9\-]+)/i);
  const invoice_number = invoiceNumberMatch ? invoiceNumberMatch[1] : '';

  // Extract date
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /(?:date|dated|on)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ];
  let invoice_date = '';
  for (const pattern of datePatterns) {
    const match = ocrText.match(pattern);
    if (match) {
      invoice_date = match[1];
      break;
    }
  }

  // Extract supplier name (usually at the top)
  const supplierMatch = ocrText.match(/(?:from|supplier|vendor|company|business)[\s:]*([A-Z][A-Za-z\s&.,]+)/i) ||
    ocrText.match(/^([A-Z][A-Za-z\s&.,]{3,30})/m);
  const supplier_name = supplierMatch ? supplierMatch[1].trim() : '';

  // Extract totals
  const totalPatterns = [
    /(?:total|grand\s*total|amount\s*due|balance)[\s:$]*([\d,]+\.?\d*)/i,
    /(?:total|grand\s*total)[\s:]*\$?([\d,]+\.?\d*)/i,
  ];
  let grand_total = '';
  for (const pattern of totalPatterns) {
    const match = text.match(pattern);
    if (match) {
      grand_total = match[1].replace(/,/g, '');
      break;
    }
  }

  // Extract subtotal
  const subtotalMatch = text.match(/(?:subtotal|sub\s*total)[\s:$]*([\d,]+\.?\d*)/i);
  const subtotal = subtotalMatch ? subtotalMatch[1].replace(/,/g, '') : '';

  // Extract tax
  const taxMatch = text.match(/(?:tax|vat|gst|sales\s*tax)[\s:$]*([\d,]+\.?\d*)/i);
  const tax = taxMatch ? taxMatch[1].replace(/,/g, '') : '';

  // Extract invoice type
  let invoice_type: 'Purchase Invoice' | 'Purchase Order' | 'Sales Invoice' | 'Other' = 'Other';
  if (/purchase\s*invoice|bill/i.test(ocrText)) {
    invoice_type = 'Purchase Invoice';
  } else if (/purchase\s*order|p\.?o\.?/i.test(ocrText)) {
    invoice_type = 'Purchase Order';
  } else if (/sales\s*invoice|receipt/i.test(ocrText)) {
    invoice_type = 'Sales Invoice';
  }

  // Helper function to check if a line looks like an address
  const looksLikeAddress = (line: string): boolean => {
    const addressKeywords = /\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd|suite|apt|floor|building|city|state|zip|postal|p\.?o\.?\s*box)\b/i;
    const zipPattern = /\b\d{5}(-\d{4})?\b/; // US zip code
    const postalPattern = /\b[A-Z]\d[A-Z]\s?\d[A-Z]\d\b/i; // Canadian postal

    return addressKeywords.test(line) || zipPattern.test(line) || postalPattern.test(line);
  };

  // Helper function to check if line looks like a valid item
  const looksLikeItem = (line: string): boolean => {
    // Must have at least 2 numbers (qty and price)
    const numbers = line.match(/\d+(?:\.\d+)?/g);
    if (!numbers || numbers.length < 2) return false;

    // Should have some text (item name)
    const hasText = /[A-Za-z]{2,}/.test(line);
    if (!hasText) return false;

    // Should NOT be a total/subtotal/tax line
    if (/total|subtotal|tax|grand|balance|due/i.test(line)) return false;

    // Should NOT look like an address
    if (looksLikeAddress(line)) return false;

    // Should NOT be just a date
    if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(line.trim())) return false;

    return true;
  };

  // Extract line items with improved filtering
  const items: any[] = [];

  // Pattern 1: Item name, qty, unit price, total (e.g., "Office Chair 2 150 300")
  const itemPattern1 = /^(.+?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/;

  // Pattern 2: Item name qty x price = total (e.g., "Printer Paper 5 x 8 = 40")
  const itemPattern2 = /^(.+?)\s+(\d+(?:\.\d+)?)\s*[x@]\s*(\d+(?:\.\d+)?)\s*[=]?\s*(\d+(?:\.\d+)?)$/i;

  // Pattern 3: Item name with comma-separated numbers (e.g., "Office Chair, 2, 150, 300")
  const itemPattern3 = /^(.+?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)$/;

  for (const line of lines) {
    if (!looksLikeItem(line)) continue;

    let match = line.match(itemPattern1) || line.match(itemPattern2) || line.match(itemPattern3);

    if (match) {
      const itemName = match[1].trim();
      const qty = match[2];
      const unitPrice = match[3];
      const totalPrice = match[4];

      // Skip if item name is too short or looks like a number
      if (itemName.length < 2 || /^\d+$/.test(itemName)) continue;

      // Additional validation: check if total ≈ qty * unit_price (with tolerance)
      const calculatedTotal = parseFloat(qty) * parseFloat(unitPrice);
      const actualTotal = parseFloat(totalPrice);
      const tolerance = Math.max(1, actualTotal * 0.1); // 10% tolerance or minimum 1

      if (Math.abs(calculatedTotal - actualTotal) <= tolerance || actualTotal > 0) {
        items.push({
          item_name: itemName,
          quantity: qty,
          unit_price: unitPrice,
          total_price: totalPrice,
        });
      }
    }
  }

  // If no items found, try a more lenient approach but still filter addresses
  if (items.length === 0) {
    const potentialItems = lines.filter(line => {
      const hasNumber = /\d/.test(line);
      const hasText = /[A-Za-z]{3,}/.test(line);
      const notTotal = !/total|subtotal|tax|grand|balance|due/i.test(line);
      const notAddress = !looksLikeAddress(line);
      const notDate = !/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(line.trim());

      return hasNumber && hasText && notTotal && notAddress && notDate && line.length > 5;
    });

    for (const line of potentialItems.slice(0, 10)) {
      // Extract all numbers from the line
      const numbers = line.match(/\d+(?:\.\d+)?/g);

      if (numbers && numbers.length >= 2) {
        // Extract text (item name) by removing all numbers and special chars
        const itemName = line.replace(/\d+(?:\.\d+)?/g, '').replace(/[,@x×=]/gi, '').trim();

        // Skip if item name is too short
        if (itemName.length < 2) continue;

        // Assume format: item_name qty unit_price total
        // Or if only 2 numbers: item_name qty total (unit_price = total/qty)
        let qty, unitPrice, totalPrice;

        if (numbers.length >= 3) {
          qty = numbers[0];
          unitPrice = numbers[1];
          totalPrice = numbers[2];
        } else if (numbers.length === 2) {
          qty = numbers[0];
          totalPrice = numbers[1];
          unitPrice = (parseFloat(totalPrice) / parseFloat(qty)).toFixed(2);
        } else {
          continue;
        }

        items.push({
          item_name: itemName,
          quantity: qty,
          unit_price: unitPrice,
          total_price: totalPrice,
        });
      }
    }
  }

  return {
    invoice_number: invoice_number || `INV-${Date.now()}`,
    invoice_date: invoice_date || new Date().toISOString().split('T')[0],
    supplier_name: supplier_name || 'Unknown Supplier',
    invoice_type: invoice_type,
    raw_text: ocrText,
    items: items.length > 0 ? items : [{
      item_name: 'Item',
      quantity: '1',
      unit_price: grand_total || '0',
      total_price: grand_total || '0',
    }],
    subtotal: subtotal || grand_total || '0',
    tax: tax || '0',
    grand_total: grand_total || '0',
    confidence_notes: 'Extracted using OCR and pattern matching. Please review and edit before saving.',
  };
}
