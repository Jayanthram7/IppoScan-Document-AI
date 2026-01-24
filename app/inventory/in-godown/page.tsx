'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

interface GodownItem {
    item_name: string;
    total_quantity: number;
    unit_price: string;
}

export default function InGodownPage() {
    const [items, setItems] = useState<GodownItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="text-center py-8">Loading godown inventory...</div>;
    }

    const headers = ['Item Name', 'Available Quantity', 'Unit Price'];
    const rows = items.map((item) => [
        item.item_name,
        item.total_quantity.toString(),
        `$${parseFloat(item.unit_price).toFixed(2)}`,
    ]);

    return (
        <div className="p-8">
            <Card title="In Godown - Available Stock">
                <p className="text-gray-600 mb-6">
                    Available stock from Purchase Orders (minus items already sold via Sales Invoices).
                </p>

                {items.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No stock available</p>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Total Items: <span className="font-semibold">{items.length}</span>
                        </div>
                        <Table headers={headers} rows={rows} />
                    </>
                )}
            </Card>
        </div>
    );
}
