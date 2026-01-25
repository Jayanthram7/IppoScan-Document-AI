'use client';

import React, { useEffect, useState } from 'react';
import { ValidationBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import type { InventoryStatus } from '@/types/invoice';

interface Invoice {
    _id: string;
    invoice_number: string;
    invoice_date: string;
    supplier_name: string;
    invoice_type: string;
    inventory_status: InventoryStatus;
    validation_status: string;
    structured_data: {
        grand_total: string;
    };
}

interface InventoryStatusListProps {
    status: InventoryStatus;
    title: string;
    description: string;
}

export function InventoryStatusList({ status, title, description }: InventoryStatusListProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, [status]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/invoices');
            if (response.ok) {
                const data = await response.json();
                const filtered = (data.invoices || []).filter(
                    (inv: Invoice) => inv.inventory_status === status
                );
                setInvoices(filtered);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading invoices...</div>;
    }
    const handleStatusUpdate = async (invoiceId: string, invoiceNumber: string) => {
        if (!confirm(`Are you sure you want to mark invoice ${invoiceNumber} as Valid?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    validation_status: 'Valid',
                }),
            });

            if (response.ok) {
                alert('Invoice status updated successfully!');
                fetchInvoices(); // Refresh the list
            } else {
                const error = await response.json();
                alert(`Failed to update status: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating invoice status:', error);
            alert('Failed to update invoice status');
        }
    };

    const filteredInvoices = searchQuery
        ? invoices.filter(inv =>
            inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : invoices;

    if (loading) {
        return <div className="text-center py-8">Loading invoices...</div>;
    }

    return (
        <div className="p-8 bg-[#F8F7F4] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 text-sm mt-1">{description}</p>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">All Invoices ({filteredInvoices.length})</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice Number</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{status === 'Delivered' ? 'Customer' : 'Supplier'}</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No invoices found in {status} status
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <Link href={`/invoices/${invoice._id}`} className="text-sm font-medium text-gray-900 hover:text-gray-600">
                                                {invoice.invoice_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.supplier_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{invoice.invoice_type}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ${parseFloat(invoice.structured_data?.grand_total || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ValidationBadge status={invoice.validation_status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/invoices/${invoice._id}`}>
                                                    <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                        View
                                                    </button>
                                                </Link>
                                                {(invoice.validation_status === 'Potential Fraud' || invoice.validation_status === 'Needs Review') && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(invoice._id, invoice.invoice_number)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white border-2 border-emerald-500 rounded-lg hover:bg-emerald-50 transition-colors group"
                                                        title="Mark as Valid"
                                                    >
                                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>

                <div className="overflow-x-auto">
                    {invoices.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                                <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                            <p className="mt-1 text-sm text-gray-500">There are no invoices currently in {status} status.</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Invoice Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {invoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{invoice.invoice_number}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(invoice.invoice_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{invoice.supplier_name}</div>
                                            <div className="text-xs text-gray-500">{invoice.invoice_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ₹{parseFloat(invoice.structured_data.grand_total || '0').toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <ValidationBadge status={invoice.validation_status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/invoices/${invoice._id}`}>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
