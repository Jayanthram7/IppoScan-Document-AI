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
        return <div className="text-center py-8">Loading invoices...</div>;
    }

    return (
        <div className="p-8">
            <Card title={title}>
                <p className="text-gray-600 mb-6">{description}</p>

                {invoices.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No invoices found in {status} status</p>
                ) : (
                    <Table headers={headers} rows={rows} />
                )}
            </Card>
        </div>
    );
}
