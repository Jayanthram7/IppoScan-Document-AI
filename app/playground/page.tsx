'use client';

import React, { useState, useCallback } from 'react';
import Footer from '../components/Footer';

export default function PlaygroundPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Create preview URL
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreview(objectUrl);
            setResult(null);
        }
    };

    const handleProcess = async () => {
        if (!file) return;

        setIsProcessing(true);

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock response data based on file name or random
        const mockData = {
            invoiceId: "INV-" + Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            vendor: {
                name: "Acme Corp Logistics",
                address: "123 Innovation Dr, Tech City, TC 90210",
                taxId: "US-99-123456"
            },
            lineItems: [
                { description: "Logistics Service - Zone 1", quantity: 1, unitPrice: 450.00, total: 450.00 },
                { description: "Fuel Surcharge", quantity: 1, unitPrice: 45.00, total: 45.00 },
                { description: "Handling Fee", quantity: 5, unitPrice: 10.00, total: 50.00 }
            ],
            subtotal: 545.00,
            tax: 54.50,
            total: 599.50,
            confidence: 0.985,
            processingTime: "1.2s"
        };

        setResult(mockData);
        setIsProcessing(false);
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <span className="text-emerald-600">AI</span> Playground
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full uppercase tracking-wide">Beta</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Upload a document to see IppoScan's extraction engine in action.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">

                    {/* Left Panel: Upload & Preview */}
                    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">Document Source</h3>
                            {file && (
                                <button
                                    onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="flex-1 p-6 bg-gray-50/50 flex flex-col items-center justify-center relative overflow-hidden">
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-emerald-600">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-gray-400">PDF, PNG, JPG (MAX. 10MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                                </label>
                            ) : (
                                <div className="w-full h-full relative group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={handleProcess}
                                disabled={!file || isProcessing}
                                className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                  ${!file || isProcessing
                                        ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                        : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing Document...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        Run Extraction
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: JSON Output */}
                    <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">Extracted Structured Data</h3>
                            {result && (
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        Confidence: {(result.confidence * 100).toFixed(1)}%
                                    </span>
                                    <span className="text-xs text-gray-400 font-mono">{result.processingTime}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-0 relative overflow-auto bg-[#1e1e1e]">
                            {result ? (
                                <pre className="p-6 text-sm font-mono text-gray-300 leading-relaxed custom-scrollbar">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">JSON output will appear here</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
                            <div className="flex gap-2">
                                <span className="font-semibold text-gray-700">Schema:</span> Invoice_Universal_v2
                            </div>
                            <button
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)) }}
                                disabled={!result}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                Copy JSON
                            </button>
                        </div>
                    </div>

                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="font-bold text-emerald-800 text-sm">Did you know?</h4>
                        <p className="text-emerald-700 text-sm mt-0.5">
                            IppoScan uses a multi-modal approach combining OCR and LLMs to understand document context, achieving up to 99.8% accuracy on complex invoice layouts.
                        </p>
                    </div>
                </div>

            </div>
            <Footer className="bg-[#F8F7F4] mt-12" />
        </div>
    );
}
