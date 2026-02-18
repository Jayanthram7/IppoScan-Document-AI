'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function XmlDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [conversion, setConversion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [jsonString, setJsonString] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConversion();
    }, [params.id]);

    const fetchConversion = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/xml/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setConversion(data.conversion);
                setJsonString(JSON.stringify(data.conversion.convertedJson, null, 2));
            } else {
                setError('Failed to fetch conversion details');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching details');
        } finally {
            setLoading(false);
        }
    };

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJsonString(e.target.value);
        setError(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validate JSON
            let parsedJson;
            try {
                parsedJson = JSON.parse(jsonString);
            } catch (e) {
                setError('Invalid JSON format. Please correct it before saving.');
                setSaving(false);
                return;
            }

            const response = await fetch(`/api/xml/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ convertedJson: parsedJson }),
            });

            if (response.ok) {
                alert('Saved successfully!');
                fetchConversion(); // Refresh data
            } else {
                throw new Error('Failed to save changes');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this conversion?')) {
            return;
        }

        try {
            const response = await fetch(`/api/xml/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/xml-to-json');
            } else {
                alert('Failed to delete conversion');
            }
        } catch (error) {
            console.error('Error deleting conversion:', error);
            alert('Failed to delete conversion');
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (!conversion) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{error || 'Conversion not found'}</p>
                <Link href="/xml-to-json" className="text-emerald-600 hover:underline">
                    Back to list
                </Link>
            </div>
        );
    }

    return (
        <div className="px-8 py-6 bg-[#F8F7F4] min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <Link href="/xml-to-json" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to List
                </Link>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{conversion.fileName}</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Created: {new Date(conversion.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-600'
                                }`}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)]">
                {/* Original XML (Read-only) */}
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-700">Original XML</h3>
                    </div>
                    <div className="flex-1 overflow-auto p-4">
                        <pre className="text-xs font-mono text-gray-600 whitespace-pre-wrap break-words">
                            {conversion.originalXml}
                        </pre>
                    </div>
                </div>

                {/* Converted JSON (Editable) */}
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">Converted JSON (Editable)</h3>
                        <span className="text-xs text-gray-500">Edit and click Save Changes</span>
                    </div>
                    <div className="flex-1 p-0 relative">
                        <textarea
                            value={jsonString}
                            onChange={handleJsonChange}
                            className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
