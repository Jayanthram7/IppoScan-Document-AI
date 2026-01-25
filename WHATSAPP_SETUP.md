# 🚀 Quick WhatsApp Notification Setup

## Your Configuration (From Screenshot)

Based on your Twilio setup:
- **To (Your WhatsApp)**: `whatsapp:+919965576297`
- **From (Twilio)**: `whatsapp:+14155238886`

## ✅ Setup Steps

### 1. Get Your Twilio Credentials

Go to your [Twilio Console Dashboard](https://console.twilio.com) and copy:
- **Account SID** (starts with "AC...")
- **Auth Token** (click to reveal)

### 2. Update Your .env File

Add these lines to your `.env` file (create it if it doesn't exist):

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NOTIFICATION_RECIPIENT=whatsapp:+919965576297
```

**Replace:**
- `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual Account SID
- `your_auth_token_here` with your actual Auth Token

### 3. Join WhatsApp Sandbox (If Not Already Done)

1. Go to Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Send the join code from your WhatsApp (+919965576297) to the Twilio number (+14155238886)
3. You should receive a confirmation message

### 4. Restart Your Server

```bash
npm run dev
```

### 5. Test It!

Upload a new invoice and check your WhatsApp! You should receive a message like:

```
🛒 New Invoice Processed

📋 Invoice: INV-12345
📦 Type: Purchase
👤 Supplier: ABC Suppliers
💰 Amount: ₹1,234.56

✅ Invoice has been successfully processed and added to the system.
```

## 🔍 Troubleshooting

**Not receiving messages?**

1. **Check Console Logs**: Look for "WhatsApp notification sent" or error messages
2. **Verify Sandbox**: Make sure you sent the join code to the Twilio number
3. **Check Credentials**: Verify Account SID and Auth Token are correct
4. **Check Twilio Console**: Go to Messaging → Logs to see delivery status

**Still not working?**

- Make sure `.env` file is in the root directory
- Restart the dev server after updating `.env`
- Check that your WhatsApp number is correct (+919965576297)
- Verify you're using the sandbox number: whatsapp:+14155238886

## 📝 Notes

- ✅ WhatsApp-only (no SMS)
- ✅ Free with Twilio trial credits
- ✅ Works with sandbox for testing
- ✅ Instant notifications
- ✅ No spam - goes directly to your WhatsApp

## 🎯 Next Steps

Once you've added your credentials to `.env` and restarted the server, you're all set! Every new invoice will trigger a WhatsApp notification to +919965576297.

---

**Need your credentials?** Go to [Twilio Console](https://console.twilio.com) → Dashboard
