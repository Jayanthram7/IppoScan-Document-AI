'use client';

import { XmlList } from '@/components/XmlList';
import { XmlUpload } from '@/components/XmlUpload';
import { useState } from 'react';

export default function XmlToJsonPage() {
    const [showUpload, setShowUpload] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadComplete = () => {
        setShowUpload(false);
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="px-8 py-6 bg-[#F8F7F4] min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">XML to JSON Conversion</h1>
                    <p className="text-gray-600 text-sm mt-1">Convert XML files to JSON and manage your conversions.</p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add XML File
                </button>
            </div>

            {showUpload && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Upload XML</h2>
                            <button
                                onClick={() => setShowUpload(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <XmlUpload onUploadComplete={handleUploadComplete} />
                    </div>
                </div>
            )}

            <XmlList refreshTrigger={refreshTrigger} />
        </div>
    );
}
