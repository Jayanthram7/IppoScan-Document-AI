import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
const notificationRecipient = process.env.NOTIFICATION_RECIPIENT; // Your phone number

let client: any = null;

// Initialize client only if credentials are available
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

interface InvoiceNotification {
    invoiceNumber: string;
    invoiceType: 'Purchase' | 'Sales' | 'Transit';
    customerOrSupplier: string;
    totalAmount: number;
    currency?: string;
    items?: Array<{
        item_name: string;
        quantity: number;
        unit_price: number;
        total_price: number;
    }>;
}

/**
 * Send WhatsApp notification for new invoice
 */
export async function sendWhatsAppNotification(invoice: InvoiceNotification): Promise<boolean> {
    if (!client || !twilioWhatsAppNumber || !notificationRecipient) {
        console.warn('Twilio WhatsApp not configured. Skipping notification.');
        return false;
    }

    try {
        const message = formatInvoiceMessage(invoice);

        await client.messages.create({
            body: message,
            from: twilioWhatsAppNumber,
            to: `whatsapp:${notificationRecipient}`
        });

        console.log(`WhatsApp notification sent for invoice ${invoice.invoiceNumber}`);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        return false;
    }
}

/**
 * Send SMS notification for new invoice
 */
export async function sendSMSNotification(invoice: InvoiceNotification): Promise<boolean> {
    if (!client || !twilioPhoneNumber || !notificationRecipient) {
        console.warn('Twilio SMS not configured. Skipping notification.');
        return false;
    }

    try {
        const message = formatInvoiceMessage(invoice);

        await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: notificationRecipient
        });

        console.log(`SMS notification sent for invoice ${invoice.invoiceNumber}`);
        return true;
    } catch (error) {
        console.error('Error sending SMS notification:', error);
        return false;
    }
}

/**
 * Send WhatsApp notification for new invoice
 */
export async function sendInvoiceNotification(invoice: InvoiceNotification): Promise<void> {
    if (!client || !twilioWhatsAppNumber || !notificationRecipient) {
        console.warn('Twilio WhatsApp not configured. Skipping notification.');
        return;
    }

    try {
        const message = formatInvoiceMessage(invoice);

        await client.messages.create({
            body: message,
            from: twilioWhatsAppNumber,
            to: notificationRecipient
        });

        console.log(`WhatsApp notification sent for invoice ${invoice.invoiceNumber}`);
    } catch (error) {
        console.error('Error sending WhatsApp notification:', error);
        throw error;
    }
}

/**
 * Format invoice message
 */
function formatInvoiceMessage(invoice: InvoiceNotification): string {
    const currency = invoice.currency || '$';
    const emoji = getInvoiceEmoji(invoice.invoiceType);

    let message = `${emoji} *New Invoice Processed*

📋 Invoice: ${invoice.invoiceNumber}
📦 Type: ${invoice.invoiceType}
👤 ${invoice.invoiceType === 'Purchase' ? 'Supplier' : 'Customer'}: ${invoice.customerOrSupplier}
💰 Amount: ${currency}${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Add line items if available
    if (invoice.items && invoice.items.length > 0) {
        message += `\n\n📦 *Items:*`;
        invoice.items.forEach((item, index) => {
            message += `\n${index + 1}. ${item.item_name}`;
            message += `\n   Qty: ${item.quantity} × ${currency}${item.unit_price.toFixed(2)} = ${currency}${item.total_price.toFixed(2)}`;
        });
    }

    message += `\n\n✅ Invoice has been successfully processed and added to the system.`;

    return message;
}

/**
 * Get emoji based on invoice type
 */
function getInvoiceEmoji(type: string): string {
    switch (type) {
        case 'Purchase':
            return '🛒';
        case 'Sales':
            return '✅';
        case 'Transit':
            return '🚚';
        default:
            return '📄';
    }
}
