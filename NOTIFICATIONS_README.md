# 📱 Invoice Notification System

## Overview

Your application now sends **WhatsApp** and **SMS notifications** whenever a new invoice is processed!

## ✨ What You Get

Every time an invoice is uploaded and processed, you'll receive an instant notification with:

- 📋 **Invoice Number**: The unique invoice ID
- 📦 **Invoice Type**: Purchase, Sales, or Transit
- 👤 **Customer/Supplier**: Who the invoice is from/to
- 💰 **Total Amount**: The invoice total with currency

## 📲 Example Notification

```
🛒 New Invoice Processed

📋 Invoice: INV-12345
📦 Type: Purchase
👤 Supplier: ABC Suppliers
💰 Amount: ₹1,234.56

✅ Invoice has been successfully processed and added to the system.
```

## 🚀 Quick Setup (5 minutes)

### 1. Install Twilio Package ✅
Already done! The `twilio` package is installed.

### 2. Get Twilio Account (Free)

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get free trial credits ($15-20)
3. Copy your **Account SID** and **Auth Token**

### 3. Set Up WhatsApp (Easiest)

1. In Twilio Console → **Messaging** → **Try WhatsApp**
2. Send the join code from your WhatsApp to activate
3. Done! You can now receive WhatsApp messages

### 4. Add to .env File

Add these lines to your `.env` file:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NOTIFICATION_RECIPIENT=whatsapp:+919876543210
```

Replace `+919876543210` with your actual WhatsApp number (with country code).

### 5. Test It!

1. Restart your dev server: `npm run dev`
2. Upload a new invoice
3. Check your WhatsApp! 🎉

## 📁 Files Created

- `lib/twilio/notifications.ts` - Notification service
- `TWILIO_SETUP.md` - Detailed setup guide
- `.env.twilio.example` - Environment variables template

## 🔧 Configuration

### Change Currency

Edit `app/api/invoices/route.ts` around line 295:

```typescript
currency: '₹', // Change to '$', '€', '£', etc.
```

### Use SMS Instead of WhatsApp

In your `.env` file:

```env
TWILIO_PHONE_NUMBER=+1234567890  # Your Twilio number
NOTIFICATION_RECIPIENT=+919876543210  # Remove 'whatsapp:' prefix
```

### Send to Multiple Numbers

Modify `lib/twilio/notifications.ts` to loop through an array of recipients.

## 💡 How It Works

1. User uploads invoice → Invoice is processed
2. Invoice saved to database → Notification triggered
3. Twilio sends WhatsApp/SMS → You get instant alert
4. If WhatsApp fails → Automatically falls back to SMS

## 🎯 Use Cases

- ✅ Get instant alerts when customers place orders
- ✅ Know immediately when suppliers send invoices
- ✅ Track business activity in real-time
- ✅ Never miss an important transaction
- ✅ Monitor your business from anywhere

## 💰 Cost

- **WhatsApp**: ~₹0.40 per message (~$0.005)
- **SMS**: ~₹0.60 per message (~$0.0075)
- **Free Trial**: Twilio gives free credits to start

For 100 invoices/month: ~₹40-60 (~$0.50-0.75)

## 🐛 Troubleshooting

**Not receiving messages?**
- Check console logs for errors
- Verify environment variables are set
- Make sure you joined WhatsApp sandbox
- Check Twilio Console for delivery status

**Messages going to spam?**
- WhatsApp messages won't go to spam
- For SMS, use verified sender ID

**Want to disable notifications?**
- Simply don't set the Twilio environment variables
- The app will work normally without notifications

## 📚 Learn More

See `TWILIO_SETUP.md` for detailed setup instructions and troubleshooting.

---

**Ready to get started?** Follow the Quick Setup above and start receiving notifications in 5 minutes! 🚀
