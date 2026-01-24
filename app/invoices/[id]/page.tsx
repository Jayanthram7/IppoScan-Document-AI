import { InvoiceDetail } from '@/components/InvoiceDetail';

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="px-4 py-8">
      <div className="mb-6">
        <a
          href="/invoices"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Invoices
        </a>
      </div>
      <InvoiceDetail invoiceId={id} />
    </div>
  );
}

