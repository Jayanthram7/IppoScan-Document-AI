'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { Table } from './ui/Table';
import { ValidationBadge } from './ui/Badge';
import { Button } from './ui/Button';
import Link from 'next/link';

interface Invoice {
  _id: string;
  invoice_number: string;
  invoice_date: string;
  supplier_name: string;
  validation_status: string;
  structured_data: {
    grand_total: string;
  };
}

export function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        let filtered = data.invoices || [];

        if (filter !== 'all') {
          filtered = filtered.filter((inv: Invoice) => inv.validation_status === filter);
        }

        setInvoices(filtered);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId: string, invoiceNumber: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the invoice list
        fetchInvoices();
      } else {
        const error = await response.json();
        alert(`Failed to delete invoice: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  const headers = ['Invoice Number', 'Date', 'Supplier', 'Total', 'Status', 'Actions'];
  const rows = invoices.map((invoice) => [
    invoice.invoice_number,
    new Date(invoice.invoice_date).toLocaleDateString(),
    invoice.supplier_name,
    `$${parseFloat(invoice.structured_data?.grand_total || '0').toFixed(2)}`,
    <ValidationBadge key={invoice._id} status={invoice.validation_status} />,
    <div key={invoice._id} className="flex gap-2">
      <Link href={`/invoices/${invoice._id}`}>
        <Button variant="outline" size="sm">View</Button>
      </Link>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDelete(invoice._id, invoice.invoice_number)}
        className="text-red-600 hover:text-red-800 hover:border-red-600"
        title="Delete invoice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </Button>
    </div>,
  ]);

  return (
    <Card title="Invoices">
      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'Valid' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('Valid')}
        >
          Valid
        </Button>
        <Button
          variant={filter === 'Needs Review' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('Needs Review')}
        >
          Needs Review
        </Button>
        <Button
          variant={filter === 'Potential Fraud' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('Potential Fraud')}
        >
          Potential Fraud
        </Button>
      </div>

      {invoices.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No invoices found</p>
      ) : (
        <Table headers={headers} rows={rows} />
      )}
    </Card>
  );
}

