# Docusense AI - Document Intelligence Platform

A full-stack AI-driven Document Intelligence application for Supply Chain Automation built with Next.js, Tailwind CSS, and Google Gemini AI.

## Features

- **AI-Powered Invoice Extraction**: Upload handwritten or printed invoices and extract structured data using Gemini Vision API
- **Smart Validation**: Automatic anomaly detection and fraud prevention using Gemini Text API
- **Intelligent Querying**: RAG-based chatbot for natural language queries about invoices and transactions
- **Dashboard Analytics**: Real-time metrics on invoices, anomalies, supplier spend, and inventory
- **Vector Search**: Semantic search over invoice and transaction embeddings

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Google Gemini (Vision, Text, Embeddings)
- **Database**: MongoDB
- **Storage**: Local filesystem (can be upgraded to cloud storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or Atlas)
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Docusense AI"
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Create the uploads directory:
```bash
mkdir -p public/uploads
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
docusense-ai/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── invoices/          # Invoice pages
│   └── chat/              # Chat interface
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utility libraries
│   ├── gemini/           # Gemini API integrations
│   ├── db/               # MongoDB models and utilities
│   └── storage/          # File storage utilities
├── types/                 # TypeScript type definitions
└── public/               # Static files and uploads
```

## API Routes

- `POST /api/upload` - Upload invoice file
- `POST /api/process` - Process invoice with AI extraction
- `POST /api/validate` - Validate invoice data
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/[id]` - Get invoice by ID
- `GET /api/dashboard` - Get dashboard statistics
- `POST /api/chat` - RAG chatbot endpoint

## Usage

### Upload and Process Invoice

1. Navigate to the home page
2. Click to upload an invoice (PNG, JPG, or PDF)
3. Click "Upload & Process"
4. The system will:
   - Extract data using Gemini Vision
   - Validate the invoice
   - Generate embeddings
   - Save to the database

### Query with AI Chat

1. Navigate to the Chat page
2. Ask natural language questions like:
   - "Show total purchases from supplier X last month"
   - "List invoices with anomalies"
   - "How much inventory was added this week?"

### View Dashboard

The dashboard shows:
- Total invoices processed
- Anomalies detected
- Supplier-wise spend
- Recent inventory updates

## Database Schema

### Collections

- **invoices**: Main invoice documents with extracted data, validation status, and embeddings
- **suppliers**: Supplier information and spend tracking
- **invoice_items**: Line items from invoices
- **transactions**: Transaction records with embeddings
- **inventory**: Inventory tracking

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Note: For production, consider using Vercel Blob Storage or AWS S3 for file uploads instead of local filesystem.

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key
- `MONGODB_URI`: MongoDB connection string
- `NEXT_PUBLIC_APP_URL`: Application URL (for development: http://localhost:3000)

## License

MIT

