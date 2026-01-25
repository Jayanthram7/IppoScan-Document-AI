'use client';

import React, { useEffect, useState } from 'react';
import { ValidationBadge } from './ui/Badge';
import { Invoice } from '@/types/invoice';

interface InvoiceDetailProps {
  invoiceId: string;
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice | null>(null);
  const [saving, setSaving] = useState(false);

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
        setEditedInvoice(data.invoice);
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInvoice(JSON.parse(JSON.stringify(invoice))); // Deep copy
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInvoice(invoice);
  };

  const handleSave = async () => {
    if (!editedInvoice) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedInvoice),
      });

      if (response.ok) {
        const data = await response.json();
        setInvoice(data.invoice);
        setIsEditing(false);
        alert('Invoice updated successfully!');
      } else {
        alert('Failed to update invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (!editedInvoice) return;
    setEditedInvoice({ ...editedInvoice, [field]: value });
  };

  const updateStructuredData = (field: string, value: any) => {
    if (!editedInvoice) return;
    setEditedInvoice({
      ...editedInvoice,
      structured_data: { ...editedInvoice.structured_data, [field]: value }
    });
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    if (!editedInvoice || !editedInvoice.structured_data.items) return;
    const newItems = [...editedInvoice.structured_data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedInvoice({
      ...editedInvoice,
      structured_data: { ...editedInvoice.structured_data, items: newItems }
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoice...</div>;
  }

  if (!invoice || !editedInvoice) {
    return <div className="text-center py-8">Invoice not found</div>;
  }

  const displayInvoice = isEditing ? editedInvoice : invoice;
  const itemsRows = displayInvoice.structured_data.items || [];

  return (
    <div className="space-y-6 p-6 bg-[#F8F7F4] min-h-screen">
      {/* Header with Edit/Save buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Invoice
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Invoice Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
            {isEditing ? (
              <input
                type="text"
                value={editedInvoice.invoice_number}
                onChange={(e) => updateField('invoice_number', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-blue-600">{displayInvoice.invoice_number}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Date</p>
            {isEditing ? (
              <input
                type="date"
                value={editedInvoice.invoice_date.split('T')[0]}
                onChange={(e) => updateField('invoice_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-blue-600">
                {new Date(displayInvoice.invoice_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Supplier</p>
            {isEditing ? (
              <input
                type="text"
                value={editedInvoice.supplier_name}
                onChange={(e) => updateField('supplier_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">{displayInvoice.supplier_name}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <ValidationBadge status={displayInvoice.validation_status} />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-base font-bold text-gray-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Subtotal</p>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedInvoice.structured_data.subtotal || '0'}
                  onChange={(e) => updateStructuredData('subtotal', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-2xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-600">
                  ${parseFloat(displayInvoice.structured_data.subtotal || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tax</p>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedInvoice.structured_data.tax || '0'}
                  onChange={(e) => updateStructuredData('tax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-2xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-600">
                  ${parseFloat(displayInvoice.structured_data.tax || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
              <p className="text-sm text-gray-600 mb-1">Grand Total</p>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  value={editedInvoice.structured_data.grand_total || '0'}
                  onChange={(e) => updateStructuredData('grand_total', e.target.value)}
                  className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-2xl font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ) : (
                <p className="text-2xl font-bold text-emerald-600">
                  ${parseFloat(displayInvoice.structured_data.grand_total || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Section */}
      {itemsRows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {itemsRows.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.item_name}
                          onChange={(e) => updateLineItem(i, 'item_name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{item.item_name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(i, 'quantity', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => updateLineItem(i, 'unit_price', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">${parseFloat(item.unit_price || '0').toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={item.total_price}
                          onChange={(e) => updateLineItem(i, 'total_price', e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm text-gray-900">${parseFloat(item.total_price || '0').toFixed(2)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Validation Issues Section */}
      {invoice.validation_issues && invoice.validation_issues.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Validation Issues</h2>
          <div className="space-y-3">
            {invoice.validation_issues.map((issue, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">{issue.field || 'General'}:</span> {issue.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw Text Section - At the end */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Raw Text</h2>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {invoice.raw_text || 'No raw text available'}
          </pre>
        </div>
      </div>
    </div>
  );
}
