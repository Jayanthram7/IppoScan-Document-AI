'use client';

import React from 'react';
import Footer from '../components/Footer';

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-[#F8F7F4] p-8">
            <div className="max-w-[7xl] mx-auto space-y-12">

                {/* Header */}
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">System Architecture & Feature Ecosystem</h1>
                    <p className="text-gray-500">
                        A holistic view of IppoScan's architecture, including Ingestion/RAG pipelines, Management Tools, Utilities, and Observability services.
                    </p>
                </div>

                {/* Architecture Diagram */}
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-8 overflow-x-auto">
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:20px_20px]"></div>

                    <div className="relative min-w-[1000px] flex justify-center gap-12 p-4">

                        {/* Sidebar: Utilities & Input */}
                        <div className="flex flex-col gap-12 pt-20">
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wide text-center">Data Sources</h3>
                                <Node title="User Uploads Invoice" icon="upload" color="blue" />
                                <Node title="XML Files" icon="code" color="gray" />
                            </div>

                            <div className="space-y-4 pt-12 border-t border-dashed border-gray-200">
                                <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wide text-center">Utilities</h3>
                                <div className="relative">
                                    <Node title="XML to JSON Converter" icon="code" color="orange" />
                                    <Arrow />
                                    <Node title="JSON Export" icon="download" color="gray" />
                                </div>
                            </div>
                        </div>

                        {/* Main Column: Ingestion Pipeline */}
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-emerald-100 pb-2 mb-4">Ingestion Pipeline</h2>

                            <Node title="Ingestion API Gateway" icon="server" color="gray" />
                            <Arrow />
                            <Node title="File Storage Local" icon="storage" color="gray" />
                            <Arrow />
                            <Node title="Google Flan T5 (Vision API)" icon="ai" color="purple" />
                            <Arrow />
                            <Node title="Extract Structured JSON" icon="code" color="indigo" />
                            <Arrow />
                            <div className="relative">
                                <Node title="Save to MongoDB" icon="db" color="green" />
                                {/* Branch to Anomaly Detection */}
                                <div className="absolute top-1/2 left-full w-8 h-0.5 bg-gray-300"></div>
                            </div>
                            <Arrow />
                            <Node title="Google Flan T5 (Validation)" icon="ai" color="purple" />
                            <Arrow />
                            <div className="relative">
                                <Node title="Update Validation Status" icon="check" color="emerald" />
                            </div>
                            <Arrow />
                            <Node title="Generate Embeddings" icon="ai" color="purple" />
                            <Arrow />
                            <Node title="Store in MongoDB" icon="db" color="green" />
                        </div>

                        {/* Center Column: Management & Observability */}
                        <div className="flex flex-col items-center gap-8 pt-32">

                            {/* Anomaly Detection (connected from Save to MongoDB) */}
                            <div className="relative">
                                <div className="absolute top-1/2 right-full w-8 h-0.5 bg-gray-300"></div>
                                <Node title="Anomaly Detection Engine" icon="alert" color="red" />
                            </div>

                            <div className="h-16 border-l-2 border-dashed border-gray-200"></div>

                            {/* Invoices Management */}
                            <Node title="Invoices Management UI" icon="invoices" color="blue" />

                            <div className="h-16 border-l-2 border-dashed border-gray-200"></div>

                            {/* Dashboard & Status */}
                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                                <h3 className="font-bold text-gray-900 text-center text-sm">Observability & monitoring</h3>
                                <Node title="Dashboard Analytics" icon="dashboard" color="orange" />
                                <Node title="System Status Monitor" icon="activity" color="emerald" />
                                <Node title="Eval Metrics (Accuracy)" icon="chart" color="cyan" />
                            </div>
                        </div>

                        {/* Right Column: RAG Pipeline */}
                        <div className="flex flex-col items-center space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-100 pb-2 mb-4">RAG Pipeline</h2>

                            <Node title="User Query" icon="user" color="blue" />
                            <Arrow />
                            <Node title="Google Flan T5 (Embeddings)" icon="ai" color="purple" />
                            <Arrow />
                            <Node title="Vector Search MongoDB" icon="search" color="green" />
                            <Arrow />
                            <Node title="Retrieve Context" icon="db" color="gray" />
                            <Arrow />
                            <Node title="Google Flan T5 (RAG)" icon="ai" color="purple" />
                            <Arrow />
                            <div className="relative">
                                <Node title="Return Answer" icon="chat" color="blue" />
                                <Arrow />
                                <Node title="Twilio (WhatsApp)" icon="whatsapp" color="orange" />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <Footer className="bg-[#F8F7F4] mt-12" />
        </div>
    );
}

// Components
function Node({ title, icon, color }: { title: string, icon: string, color: string }) {
    const getColorClasses = (c: string) => {
        const map: Record<string, string> = {
            blue: 'bg-blue-50 text-blue-600 border-blue-200',
            green: 'bg-green-50 text-green-600 border-green-200',
            purple: 'bg-purple-50 text-purple-600 border-purple-200',
            indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
            gray: 'bg-gray-50 text-gray-600 border-gray-200',
            orange: 'bg-orange-50 text-orange-600 border-orange-200',
            emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
            red: 'bg-red-50 text-red-600 border-red-200',
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
        };
        return map[c] || map.gray;
    };

    const getIcon = (i: string) => {
        switch (i) {
            case 'upload': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />;
            case 'storage': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />;
            case 'ai': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
            case 'db': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />;
            case 'code': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />;
            case 'user': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
            case 'search': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />;
            case 'chat': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />;
            case 'check': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />;
            case 'dashboard': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />;
            case 'whatsapp': return <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" fill="currentColor" />;
            case 'server': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />;
            case 'alert': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />;
            case 'invoices': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
            case 'activity': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />; // Using lightning bolt for activity
            case 'chart': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />;
            case 'download': return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />;
            default: return null;
        }
    };

    return (
        <div className={`relative z-10 bg-white p-3 px-4 rounded-xl border shadow-sm flex items-center gap-3 min-w-[200px] justify-center text-center ${getColorClasses(color).replace('bg-', 'border-').split(' ')[2]}`}>
            <div className={`p-1.5 rounded-lg flex-shrink-0 ${getColorClasses(color).split(' ')[0]} ${getColorClasses(color).split(' ')[1]}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(icon)}
                </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">{title}</span>
        </div>
    );
}

function Arrow() {
    return (
        <div className="flex justify-center h-6">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-3-3m3 3l3-3" />
            </svg>
        </div>
    );
}
