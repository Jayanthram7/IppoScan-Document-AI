import { InvoiceUpload } from '@/components/InvoiceUpload';
import { Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Document Intelligence Platform
          </h1>
          <p className="text-lg text-gray-600">
            Upload invoices to extract data, validate, and gain insights using AI
          </p>
        </div>

        <Card className="mb-8">
          <InvoiceUpload />
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="AI-Powered Extraction">
            <p className="text-gray-600 text-sm">
              Upload handwritten or printed invoices. Our AI extracts all relevant data automatically.
            </p>
          </Card>
          <Card title="Smart Validation">
            <p className="text-gray-600 text-sm">
              Automatic anomaly detection and fraud prevention using advanced AI validation.
            </p>
          </Card>
          <Card title="Intelligent Querying">
            <p className="text-gray-600 text-sm">
              Ask natural language questions about your invoices and get instant answers.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

