---
name: Document Intelligence Supply Chain App

---

# Document Intelligence

Supply Chain Automation Application

## Architecture Overview

```mermaid
flowchart TD
    A[User Uploads Invoice] --> B[File Storage Local]
    B --> C[Gemini Vision API]
    C --> D[Extract Structured JSON]
    D --> E[Save to MongoDB]
    E --> F[Gemini Text Validation]
    F --> G[Update Validation Status]
    G --> H[Generate Embeddings]
    H --> I[Store Embeddings in MongoDB]
    
    J[User Query] --> K[Gemini Embeddings API]
    K --> L[Vector Search MongoDB]
    L --> M[Retrieve Context]
    M --> N[Gemini Text RAG]
    N --> O[Return Answer]
    
    P[Dashboard] --> E
    P --> G
```



## Project Structure

```javascript
docusense-ai/
├── app/
│   ├── (routes)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── invoices/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── chat/
│   │       └── page.tsx
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts
│   │   ├── process/
│   │   │   └── route.ts
│   │   └── chat/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── gemini/
│   │   ├── vision.ts
│   │   ├── text.ts
│   │   └── embeddings.ts
│   ├── db/
│   │   ├── mongodb.ts
│   │   └── models.ts
│   ├── storage/
│   │   └── fileStorage.ts
│   └── utils/
│       └── validation.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── InvoiceUpload.tsx
│   ├── InvoiceList.tsx
│   ├── InvoiceDetail.tsx
│   ├── Dashboard.tsx
│   └── ChatInterface.tsx
├── types/
│   └── invoice.ts
├── public/
│   └── uploads/
├── .env.local
├── package.json
├── tailwind.config.ts
└── next.config.js
```



## Implementation Plan

### 1. Project Setup & Dependencies

**Files to create:**

- `package.json` - Next.js 14+, React, Tailwind CSS, MongoDB driver, Gemini SDK

- `tailwind.config.ts` - Tailwind configuration

- `next.config.js` - Next.js configuration

- `.env.local` - Environment variables (GEMINI_API_KEY, MONGODB_URI)

**Dependencies:**

- `next@latest`

- `react@latest`

- `@google/generative-ai` (Gemini SDK)

- `mongodb` (MongoDB driver)

- `tailwindcss`, `autoprefixer`, `postcss`

- `@vercel/ai` (for chat streaming)

- `multer` or `formidable` (file uploads)

### 2. Database Schema (MongoDB)

**File: `lib/db/models.ts`**

Collections:

- `invoices` - Main invoice documents

- `invoice_number` (unique index)

- `invoice_date`

- `supplier_name`

- `raw_text`

- `structured_data` (JSON)

- `validation_status`

- `validation_issues`

- `embedding` (vector)
- `file_path`

- `created_at`, `updated_at`

- `suppliers` - Supplier information

- `name` (unique)

- `contact_info`

- `total_spend`

- `invoice_count`

- `invoice_items` - Line items

- `invoice_id` (reference)

- `item_name`

- `quantity`
- `unit_price`

- `total_price`

- `transactions` - Transaction records

- `invoice_id` (reference)

- `type` (purchase/inventory)

- `amount`

- `date`

- `embedding` (vector)

- `metadata`

- `inventory` - Inventory tracking

- `item_name`

- `quantity`

- `last_updated`

- `source_invoice_id`

### 3. Gemini API Integration

**File: `lib/gemini/vision.ts`**

- Function: `extractInvoiceData(imageBuffer: Buffer)`

- Uses Gemini Vision API with the specified prompt

- Returns structured JSON matching the invoice schema

- Error handling for API failures

**File: `lib/gemini/text.ts`**

- Function: `validateInvoice(invoiceData: object)`

- Uses Gemini Text API with validation prompt

- Returns validation status and issues array

- Function: `generateRAGResponse(query: string, context: string[])`

- Combines retrieved context with user query

- Returns natural language answer

**File: `lib/gemini/embeddings.ts`**

- Function: `generateEmbedding(text: string)`

- Uses Gemini Embeddings API

- Returns vector array for similarity search

### 4. File Upload & Processing

**File: `app/api/upload/route.ts`**

- Accepts multipart/form-data

- Validates file type (PNG, JPG, PDF)

- Saves to `public/uploads/` directory

- Returns file path and metadata

**File: `app/api/process/route.ts`**

- Receives file path

- Reads image file

- Calls `extractInvoiceData()` from Gemini Vision
- Parses JSON response

- Saves to MongoDB (invoices collection)

- Calls validation API

- Generates embeddings

- Updates database with validation status and embeddings

- Returns processed invoice data

**File: `lib/storage/fileStorage.ts`**

- Functions for saving/reading files

- File naming strategy (timestamp + hash)

- PDF to image conversion (if needed)

### 5. AI Validation & Anomaly Detection

**File: `app/api/validate/route.ts`**

- Receives invoice ID

- Fetches invoice from database

- Calls `validateInvoice()` from Gemini Text

- Updates invoice document with validation status

- Returns validation results

**Integration:** Validation runs automatically after invoice processing in `process/route.ts`

### 6. RAG Chatbot Implementation

**File: `app/api/chat/route.ts`**

- Receives user query

- Generates query embedding using `generateEmbedding()`

- Performs vector similarity search in MongoDB

- Search `invoices.embedding` and `transactions.embedding`

- Use cosine similarity or MongoDB Atlas Vector Search

- Retrieves top-k relevant documents

- Extracts context from retrieved documents

- Calls `generateRAGResponse()` with query + context

- Streams response using Vercel AI SDK

- Returns answer to user

**File: `components/ChatInterface.tsx`**

- Chat UI with message history

- Input field for queries

- Streaming response display

- Example queries display

### 7. Dashboard & UI Components

**File: `app/dashboard/page.tsx`**

- Dashboard layout

- Metrics cards:

- Total invoices processed

- Anomalies detected count

- Supplier-wise spend (chart/table)

- Recent inventory updates

- Uses `components/Dashboard.tsx`

**File: `app/invoices/page.tsx`**

- Invoice list view

- Filter by validation status

- Search functionality

- Uses `components/InvoiceList.tsx`

**File: `app/invoices/[id]/page.tsx`**

- Invoice detail page

- Shows all extracted fields

- Raw text preview

- Validation status badge

- Items table

- Uses `components/InvoiceDetail.tsx`

**File: `app/chat/page.tsx`**

- Chat interface page

- Uses `components/ChatInterface.tsx`

**File: `app/page.tsx`**

- Landing/home page

- Quick upload interface

- Navigation to other pages

### 8. UI Components (Tailwind CSS)

**Files in `components/ui/`:**

- `Button.tsx` - Reusable button component

- `Card.tsx` - Card container

- `Badge.tsx` - Status badges (Valid, Needs Review, Potential Fraud)

- `Input.tsx` - Form inputs

- `Table.tsx` - Data tables

**Styling:**

- Modern, clean design

- Responsive layout

- Color-coded validation statuses

- Professional enterprise-grade appearance

### 9. Type Definitions

**File: `types/invoice.ts`**

- TypeScript interfaces for:

- `Invoice`

- `InvoiceItem`

- `ValidationResult`
- `Supplier`

- `Transaction`

- `InventoryItem`

### 10. MongoDB Connection & Utilities

**File: `lib/db/mongodb.ts`**

- MongoDB client singleton

- Connection management
- Database helper functions

**File: `lib/db/models.ts`**

- Mongoose schemas or TypeScript interfaces
- Database operations (CRUD)
- Vector search functions

## Key Implementation Details

### Gemini Vision Prompt (Internal)

Stored in `lib/gemini/vision.ts` as a constant, used when calling the API.

### Vector Search Strategy

- Store embeddings as arrays in MongoDB documents

- Use MongoDB's aggregation pipeline for cosine similarity

- Alternative: Use MongoDB Atlas Vector Search if available

### Error Handling

- API failures (Gemini, MongoDB)

- Invalid file formats

- Malformed JSON responses
- Missing required fields

### Performance Considerations

- Async processing for large files

- Caching embeddings (optional)

- Pagination for invoice lists

- Indexing on `invoice_number` and `supplier_name`

## Environment Variables

```env
GEMINI_API_KEY=AIzaSyDjN4JnStnyC6fiAGPnWHlCKboarg7p-5g
MONGODB_URI=mongodb+srv://jayanthramnithin:jrnk72004nithu@cluster0.lttav.mongodb.net/?appName=Cluster0
NEXT_PUBLIC_APP_URL=http://localhost:3000
```



## Testing Strategy

- Test invoice upload with sample images

- Verify Gemini Vision extraction accuracy

- Test validation logic

- Test RAG queries with various question types

- Verify MongoDB operations

## Deployment

- Configure for Vercel deployment

- Set environment variables in Vercel dashboard

- Ensure file uploads work (may need Vercel Blob Storage for production)