'use client';

import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';

interface SystemService {
    name: string;
    status: 'operational' | 'degraded' | 'down' | 'maintenance';
    uptime: string;
    latency: string;
    lastChecked: string;
    icon: React.ReactNode;
}

export default function StatusPage() {
    const [services, setServices] = useState<SystemService[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    useEffect(() => {
        // Mock data for system status
        const mockServices: SystemService[] = [
            {
                name: 'MongoDB Database',
                status: 'operational',
                uptime: '99.99%',
                latency: '45ms',
                lastChecked: 'Just now',
                icon: (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                )
            },
            {
                name: 'Twilio API (WhatsApp)',
                status: 'operational',
                uptime: '99.95%',
                latency: '120ms',
                lastChecked: 'Just now',
                icon: (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )
            },
            {
                name: 'Google Flan T5',
                status: 'operational',
                uptime: '99.90%',
                latency: '850ms',
                lastChecked: 'Just now',
                icon: (
                    <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                )
            },
            {
                name: 'PDF Processing Service',
                status: 'operational',
                uptime: '99.99%',
                latency: '200ms',
                lastChecked: 'Just now',
                icon: (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                )
            }
        ];

        setServices(mockServices);
        setLastUpdated(new Date().toLocaleTimeString());
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'bg-green-100 text-green-700 border-green-200';
            case 'degraded': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'down': return 'bg-red-100 text-red-700 border-red-200';
            case 'maintenance': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'operational': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'down': return 'bg-red-500';
            case 'maintenance': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F7F4] p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            System Status
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-sm font-medium text-green-700">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                All Systems Operational
                            </div>
                        </h1>
                        <p className="text-gray-500 mt-2">Real-time status monitoring of Docusense AI infrastructure.</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Last updated: <span className="font-medium text-gray-900">{lastUpdated}</span>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        {service.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
                                        <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(service.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(service.status)}`}></span>
                                            {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Uptime</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{service.uptime}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Latency</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{service.latency}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Checked</p>
                                    <p className="text-sm font-bold text-gray-900 mt-0.5">{service.lastChecked}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Incident History Placeholder */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-bold text-gray-900">Recent Incidents</h3>
                    </div>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">No incidents reported</h4>
                        <p className="text-gray-500 mt-1">All systems have been operational for the last 90 days.</p>
                    </div>
                </div>

            </div>
            <Footer className="bg-[#F8F7F4] mt-12" />
        </div>
    );
}
