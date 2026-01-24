'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';
import { ValidationBadge } from './ui/Badge';
import { Table } from './ui/Table';
import { Invoice } from '@/types/invoice';

interface InvoiceDetailProps {
  invoiceId: string;
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data.invoice);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-8">Invoice not found</div>;
  }

  const itemsHeaders = ['Item Name', 'Quantity', 'Unit Price', 'Total Price'];
  const itemsRows = invoice.structured_data.items?.map((item) => [
    item.item_name,
    item.quantity,
    `$${parseFloat(item.unit_price || '0').toFixed(2)}`,
    `$${parseFloat(item.total_price || '0').toFixed(2)}`,
  ]) || [];

  return (
    <div className="space-y-6">
      <Card title="Invoice Details">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Invoice Number</p>
            <p className="text-lg font-semibold">{invoice.invoice_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="text-lg font-semibold">
              {new Date(invoice.invoice_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Supplier</p>
            <p className="text-lg font-semibold">{invoice.supplier_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <ValidationBadge status={invoice.validation_status} />
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-2">Totals</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-lg font-semibold">
                ${parseFloat(invoice.structured_data.subtotal || '0').toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tax</p>
              <p className="text-lg font-semibold">
                ${parseFloat(invoice.structured_data.tax || '0').toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Grand Total</p>
              <p className="text-lg font-semibold text-blue-600">
                ${parseFloat(invoice.structured_data.grand_total || '0').toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {invoice.validation_issues && invoice.validation_issues.length > 0 && (
        <Card title="Validation Issues">
          <ul className="space-y-2">
            {invoice.validation_issues.map((issue, index) => (
              <li key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">{issue.field || 'General'}:</span> {issue.message}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {itemsRows.length > 0 && (
        <Card title="Line Items">
          <Table headers={itemsHeaders} rows={itemsRows} />
        </Card>
      )}

      <Card title="Raw Text">
        <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {invoice.raw_text || 'No raw text available'}
          </pre>
        </div>
      </Card>
    </div>
  );
}

