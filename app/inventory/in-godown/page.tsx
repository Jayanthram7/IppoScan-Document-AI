'use client';

import React, { useEffect, useState } from 'react';

interface GodownItem {
    item_name: string;
    total_quantity: number;
    unit_price: string;
}

export default function InGodownPage() {
    const [items, setItems] = useState<GodownItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGodownItems();
    }, []);

    const fetchGodownItems = async () => {
        try {
            setLoading(true);
            // Fetch all invoices
            const response = await fetch('/api/invoices');
            if (response.ok) {
                const data = await response.json();
                const invoices = data.invoices || [];

                // Filter Purchase Orders and Sales Invoices
                const purchaseOrders = invoices.filter(
                    (inv: any) => inv.invoice_type === 'Purchase Order'
                );
                const salesInvoices = invoices.filter(
                    (inv: any) => inv.invoice_type === 'Sales Invoice'
                );

                // Calculate stock from Purchase Orders
                const itemsMap = new Map<string, { quantity: number; unit_price: string }>();

                purchaseOrders.forEach((invoice: any) => {
                    const items = invoice.structured_data?.items || [];
                    items.forEach((item: any) => {
                        const existing = itemsMap.get(item.item_name);
                        const qty = parseFloat(item.quantity) || 0;

                        if (existing) {
                            existing.quantity += qty;
                        } else {
                            itemsMap.set(item.item_name, {
                                quantity: qty,
                                unit_price: item.unit_price || '0'
                            });
                        }
                    });
                });

                // Subtract sold quantities from Sales Invoices
                salesInvoices.forEach((invoice: any) => {
                    const items = invoice.structured_data?.items || [];
                    items.forEach((item: any) => {
                        const existing = itemsMap.get(item.item_name);
                        if (existing) {
                            const soldQty = parseFloat(item.quantity) || 0;
                            existing.quantity -= soldQty;
                        }
                    });
                });

                // Convert map to array and filter out items with zero or negative quantity
                const godownItems: GodownItem[] = Array.from(itemsMap.entries())
                    .map(([name, data]) => ({
                        item_name: name,
                        total_quantity: data.quantity,
                        unit_price: data.unit_price,
                    }))
                    .filter(item => item.total_quantity > 0);

                setItems(godownItems);
            }
        } catch (error) {
            console.error('Error fetching godown items:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = searchQuery
        ? items.filter(item =>
            item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : items;

    const totalStockValue = filteredItems.reduce((sum, item) => {
        return sum + (item.total_quantity * parseFloat(item.unit_price));
    }, 0);

    if (loading) {
        return <div className="text-center py-8">Loading godown inventory...</div>;
    }

    return (
        <div className="p-8 bg-[#F8F7F4] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Godown - Available Stock</h1>
                <p className="text-gray-600 text-sm mt-1">
                    Available stock from Purchase Orders (minus items already sold via Sales Invoices)
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Total Items</span>
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{filteredItems.length}</div>
                    <div className="text-xs text-gray-500 mt-1">Unique products</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Total Quantity</span>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        {filteredItems.reduce((sum, item) => sum + item.total_quantity, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Units in stock</div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Stock Value</span>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                        ${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Total inventory value</div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Inventory Items</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search items..."
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Available Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit Price</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        {searchQuery ? 'No items found matching your search' : 'No stock available'}
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{item.item_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                {item.total_quantity.toLocaleString()} units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            ${parseFloat(item.unit_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                                            ${(item.total_quantity * parseFloat(item.unit_price)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
}
