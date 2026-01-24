'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { InvoiceReview } from './InvoiceReview';
import { InvoiceData } from '@/types/invoice';

interface InvoiceUploadProps {
  onUploadComplete?: (invoice: any) => void;
}

export function InvoiceUpload({ onUploadComplete }: InvoiceUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [filePath, setFilePath] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a PNG, JPG, or PDF file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setExtractedData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const uploadData = await uploadResponse.json();
      setFilePath(uploadData.filePath);

      // Extract invoice data (without saving)
      const extractResponse = await fetch('/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filePath: uploadData.filePath,
          mimeType: uploadData.mimeType,
        }),
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json();
        throw new Error(errorData.error || 'Extraction failed');
      }

      const extractData = await extractResponse.json();
      console.log('InvoiceUpload - received extracted data:', extractData);
      console.log('Invoice data structure:', JSON.stringify(extractData.invoiceData, null, 2));
      setExtractedData(extractData.invoiceData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInvoice = async (reviewedData: InvoiceData) => {
    try {
      setUploading(true);
      setError(null);

      // Save the reviewed invoice data
      const saveResponse = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceData: reviewedData,
          filePath: filePath,
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();

        // Handle insufficient stock error with detailed message
        if (errorData.error === 'Insufficient stock') {
          const stockMessage = `${errorData.message}\n\n${errorData.items.join('\n')}`;
          throw new Error(stockMessage);
        }

        throw new Error(errorData.error || 'Save failed');
      }

      const saveData = await saveResponse.json();
      setSuccess(true);
      setExtractedData(null);

      if (onUploadComplete) {
        onUploadComplete(saveData.invoice);
      }

      // Reset form
      setFile(null);
      setFilePath('');
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelReview = () => {
    setExtractedData(null);
    setFile(null);
    setFilePath('');
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Show review screen if data has been extracted
  if (extractedData) {
    return (
      <InvoiceReview
        extractedData={extractedData}
        onSave={handleSaveInvoice}
        onCancel={handleCancelReview}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          id="file-input"
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-gray-600 font-medium">
            {file ? file.name : 'Click to upload invoice'}
          </span>
          <span className="text-gray-400 text-sm mt-2">
            PNG, JPG, or PDF (handwritten or printed)
          </span>
        </label>
      </div>

      {file && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            variant="primary"
          >
            {uploading ? 'Processing...' : 'Upload & Extract'}
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            Invoice saved successfully!
          </p>
        </div>
      )}
    </div>
  );
}
