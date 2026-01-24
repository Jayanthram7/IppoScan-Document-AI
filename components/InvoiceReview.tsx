'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { InvoiceData } from '@/types/invoice';

interface InvoiceReviewProps {
    extractedData: InvoiceData;
    onSave: (data: InvoiceData) => void;
    onCancel: () => void;
}

export function InvoiceReview({ extractedData, onSave, onCancel }: InvoiceReviewProps) {
    const [formData, setFormData] = useState<InvoiceData>(extractedData);

    // Helper function to strip currency symbols and clean numeric values
    const stripCurrency = (value: string): string => {
        if (!value) return '0';
        // Remove $, commas, and other currency symbols, keep only numbers and decimal point
        return value.replace(/[$,]/g, '').trim() || '0';
    };

    useEffect(() => {
        // Clean all currency values by removing $ signs and other symbols
        const cleanedItems = extractedData.items.map(item => ({
            ...item,
            quantity: stripCurrency(item.quantity),
            unit_price: stripCurrency(item.unit_price),
            total_price: stripCurrency(item.total_price),
        }));

        // Recalculate totals when extracted data changes to ensure proper values
        const subtotal = cleanedItems.reduce((sum, item) => {
            return sum + (parseFloat(item.total_price) || 0);
        }, 0);

        const cleanedTax = stripCurrency(extractedData.tax);
        const cleanedGrandTotal = stripCurrency(extractedData.grand_total);

        const initialData = {
            ...extractedData,
            items: cleanedItems,
            subtotal: subtotal.toFixed(2),
            tax: cleanedTax,
            grand_total: (subtotal + (parseFloat(cleanedTax) || 0)).toFixed(2)
        };

        console.log('Cleaned invoice data for display:', initialData);
        setFormData(initialData);
    }, [extractedData]);

    const handleFieldChange = (field: keyof InvoiceData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // Recalculate item total if qty or unit_price changed
        if (field === 'quantity' || field === 'unit_price') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].unit_price) || 0;
            newItems[index].total_price = (qty * price).toFixed(2);
        }

        setFormData(prev => {
            const updated = { ...prev, items: newItems };
            return recalculateTotals(updated);
        });
    };

    const recalculateTotals = (data: InvoiceData): InvoiceData => {
        const subtotal = data.items.reduce((sum, item) => {
            return sum + (parseFloat(item.total_price) || 0);
        }, 0);

        return {
            ...data,
            subtotal: subtotal.toFixed(2),
            grand_total: (subtotal + (parseFloat(data.tax) || 0)).toFixed(2)
        };
    };

    const handleTaxChange = (value: string) => {
        setFormData(prev => {
            const updated = { ...prev, tax: value };
            const subtotal = parseFloat(updated.subtotal) || 0;
            const taxAmount = parseFloat(value) || 0;
            updated.grand_total = (subtotal + taxAmount).toFixed(2);
            return updated;
        });
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { item_name: '', quantity: '1', unit_price: '0', total_price: '0' }]
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => {
            const newItems = prev.items.filter((_, i) => i !== index);
            const updated = { ...prev, items: newItems };
            return recalculateTotals(updated);
        });
    };

    const handleSave = () => {
        // Ensure all numeric fields are properly formatted
        const dataToSave = {
            ...formData,
            subtotal: formData.subtotal || '0',
            tax: formData.tax || '0',
            grand_total: formData.grand_total || '0'
        };

        console.log('Saving invoice data:', dataToSave);
        console.log('Subtotal:', dataToSave.subtotal, 'Tax:', dataToSave.tax, 'Grand Total:', dataToSave.grand_total);

        onSave(dataToSave);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Invoice Data</h2>
                <p className="text-sm text-gray-600">Please review and edit the extracted data before saving</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Invoice Number</label>
                    <input
                        type="text"
                        value={formData.invoice_number}
                        onChange={(e) => handleFieldChange('invoice_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Invoice Date</label>
                    <input
                        type="text"
                        value={formData.invoice_date}
                        onChange={(e) => handleFieldChange('invoice_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Supplier Name</label>
                    <input
                        type="text"
                        value={formData.supplier_name}
                        onChange={(e) => handleFieldChange('supplier_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700"
                    />
                </div>
            </div>

            {/* Invoice Type */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">Invoice Type</label>
                <select
                    value={formData.invoice_type || 'Other'}
                    onChange={(e) => handleFieldChange('invoice_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700"
                >
                    <option value="Purchase Invoice">Purchase Invoice</option>
                    <option value="Purchase Order">Purchase Order</option>
                    <option value="Sales Invoice">Sales Invoice</option>
                    <option value="Other">Other</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    {formData.invoice_type === 'Purchase Invoice' && '→ Will be classified as "In Godown"'}
                    {formData.invoice_type === 'Purchase Order' && '→ Will be classified as "Source"'}
                    {formData.invoice_type === 'Sales Invoice' && '→ Will be classified as "Delivered"'}
                    {formData.invoice_type === 'Other' && '→ Will be classified as "In Travel"'}
                </p>
            </div>

            {/* Line Items */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-900">Line Items</label>
                    <Button onClick={addItem} variant="secondary" className="text-sm">
                        + Add Item
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 border">Item Name</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 border w-24">Qty</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 border w-32">Unit Price</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 border w-32">Total</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-900 border w-20">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-3 py-2 border">
                                        <input
                                            type="text"
                                            value={item.item_name}
                                            onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-blue-700"
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-blue-700"
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.unit_price}
                                            onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-blue-700"
                                        />
                                    </td>
                                    <td className="px-3 py-2 border">
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={item.total_price}
                                            readOnly
                                            className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded text-blue-700"
                                        />
                                    </td>
                                    <td className="px-3 py-2 border text-center">
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Subtotal</label>
                    <input
                        type="text"
                        value={formData.subtotal}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-blue-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Tax</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.tax}
                        onChange={(e) => handleTaxChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Grand Total</label>
                    <input
                        type="text"
                        value={formData.grand_total}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold text-blue-700"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button onClick={onCancel} variant="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="primary">
                    Save Invoice
                </Button>
            </div>
        </div>
    );
}
