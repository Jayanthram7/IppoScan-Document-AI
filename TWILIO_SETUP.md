# Twilio WhatsApp/SMS Notification Setup Guide

This guide will help you set up WhatsApp and SMS notifications for invoice processing.

## 📋 Prerequisites

- A Twilio account (sign up at https://www.twilio.com/try-twilio)
- Node.js project with environment variables support

## 🚀 Setup Steps

### 1. Install Twilio SDK

```bash
npm install twilio
```

### 2. Get Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com)
2. Find your **Account SID** and **Auth Token** on the dashboard
3. Copy these values - you'll need them for the `.env` file

### 3. Set Up Phone Number (for SMS)

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number with SMS capabilities
3. Copy the phone number (format: +1234567890)

### 4. Set Up WhatsApp (Recommended)

#### Option A: WhatsApp Sandbox (Free for Testing)
1. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow the instructions to join the sandbox by sending a code to the Twilio number
3. The sandbox number is usually: `whatsapp:+14155238886`
4. Your phone number format: `whatsapp:+1234567890`

#### Option B: WhatsApp Business API (Production)
1. Apply for WhatsApp Business API access in Twilio Console
2. Complete the verification process
3. Get your approved WhatsApp number

### 5. Configure Environment Variables

Copy the values to your `.env` file:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NOTIFICATION_RECIPIENT=+1234567890
```

**Important Notes:**
- For WhatsApp, use `whatsapp:` prefix for both sender and recipient
- For SMS, use regular phone number format with country code
- Keep your Auth Token secret - never commit it to version control

### 6. Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Upload and process a new invoice
3. You should receive a WhatsApp message or SMS with invoice details!

## 📱 Notification Format

When an invoice is processed, you'll receive:

```
🛒 *New Invoice Processed*

📋 Invoice: INV-12345
📦 Type: Purchase
👤 Supplier: ABC Suppliers
💰 Amount: ₹1,234.56

✅ Invoice has been successfully processed and added to the system.
```

## 🔧 Customization

### Change Currency Symbol

Edit `app/api/invoices/route.ts` line ~295:

```typescript
currency: '₹', // Change to '$', '€', etc.
```

### Modify Message Format

Edit `lib/twilio/notifications.ts` in the `formatInvoiceMessage` function to customize the message template.

### Change Notification Recipient

Update `NOTIFICATION_RECIPIENT` in `.env` to send to a different phone number.

## 💰 Pricing (Approximate)

- **SMS**: ~$0.0075 per message (varies by country)
- **WhatsApp**: ~$0.005-0.01 per message
- **Free Trial**: Twilio provides free credits for testing

## 🐛 Troubleshooting

### WhatsApp messages not sending?
- Make sure you've joined the WhatsApp sandbox
- Verify the phone number format includes `whatsapp:` prefix
- Check that your recipient number is verified in Twilio Console

### SMS messages not sending?
- Verify your Twilio phone number has SMS capabilities
- Check that recipient number is in E.164 format (+1234567890)
- For trial accounts, verify the recipient number in Twilio Console

### No notifications at all?
- Check console logs for error messages
- Verify all environment variables are set correctly
- Ensure Twilio credentials are valid
- The system will continue to work even if notifications fail

## 📚 Additional Resources

- [Twilio WhatsApp Quickstart](https://www.twilio.com/docs/whatsapp/quickstart)
- [Twilio SMS Quickstart](https://www.twilio.com/docs/sms/quickstart)
- [Twilio Console](https://console.twilio.com)

## 🔒 Security Best Practices

1. Never commit `.env` file to version control
2. Use environment variables for all sensitive data
3. Rotate your Auth Token periodically
4. Use separate Twilio accounts for development and production
5. Monitor your Twilio usage to prevent unexpected charges

---

**Need Help?** Check the Twilio documentation or contact support at https://support.twilio.com
