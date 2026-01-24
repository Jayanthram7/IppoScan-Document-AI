'use client';

import { InvoiceList } from '@/components/InvoiceList';
import { InvoiceUpload } from '@/components/InvoiceUpload';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export default function InvoicesPage() {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadComplete = () => {
    setShowUpload(false);
    // Refresh the invoice list
    window.location.reload();
  };

  return (
    <div className="px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">View and manage all processed invoices</p>
        </div>
        <Button onClick={() => setShowUpload(true)} variant="primary">
          + Add Invoice
        </Button>
      </div>

      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Upload Invoice</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <InvoiceUpload onUploadComplete={handleUploadComplete} />
          </div>
        </div>
      )}

      <InvoiceList />
    </div>
  );
}
