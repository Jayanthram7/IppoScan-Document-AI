'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface XmlConversion {
    _id: string;
    fileName: string;
    createdAt: string;
    updatedAt: string;
}

interface XmlListProps {
    refreshTrigger: number;
}

export function XmlList({ refreshTrigger }: XmlListProps) {
    const [conversions, setConversions] = useState<XmlConversion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchConversions();
    }, [refreshTrigger]);

    const fetchConversions = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/xml');
            if (response.ok) {
                const data = await response.json();
                setConversions(data.conversions || []);
            }
        } catch (error) {
            console.error('Error fetching conversions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/xml/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchConversions();
            } else {
                alert('Failed to delete conversion');
            }
        } catch (error) {
            console.error('Error deleting conversion:', error);
            alert('Failed to delete conversion');
        }
    };

    const filteredConversions = conversions.filter(c =>
        c.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-8">Loading XML conversions...</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Saved Conversions</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search files..."
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
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated At</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredConversions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No conversions found. Upload an XML file to get started.
                                </td>
                            </tr>
                        ) : (
                            filteredConversions.map((conversion) => (
                                <tr key={conversion._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <Link href={`/xml-to-json/${conversion._id}`} className="text-sm font-medium text-gray-900 hover:text-emerald-600">
                                                {conversion.fileName}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(conversion.createdAt).toLocaleDateString()} {new Date(conversion.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(conversion.updatedAt).toLocaleDateString()} {new Date(conversion.updatedAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/xml-to-json/${conversion._id}`}>
                                                <button className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors">
                                                    View & Edit
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(conversion._id, conversion.fileName)}
                                                className="p-1.5 text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
