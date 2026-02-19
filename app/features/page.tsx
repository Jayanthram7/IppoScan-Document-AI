'use client';

import React from 'react';
import Footer from '../components/Footer';

const features = [
    {
        title: 'Smart Invoice Processing',
        description: 'Automatically extract data from PDF invoices with AI-powered accuracy. Eliminate manual entry errors and save valuable time.',
        icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        tags: ['AI Powered', 'Automated'],
        className: 'md:col-span-1 lg:col-span-1 lg:row-span-2',
        bgPattern: false
    },

    {
        title: 'WhatsApp Integration',
        description: 'Seamlessly communicate updates via WhatsApp with Twilio.',
        icon: (
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        tags: ['Twilio', 'Chat'],
        className: 'md:col-span-2 lg:col-span-2',
        bgPattern: true
    },
    {
        title: 'Interactive Chatbot',
        description: 'Query for details regarding all data using our interactive AI assistant. Instantly access records, stats, and reports.',
        icon: (
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
        ),
        tags: ['AI Assistant', 'NLP'],
        className: 'md:col-span-2 lg:col-span-1 lg:row-span-2',
        bgPattern: true
    },
    {
        title: 'Supplier CRM',
        description: 'Manage supplier relationships and history.',
        icon: (
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        tags: ['CRM', 'Partners'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },
    {
        title: 'Financial Analytics',
        description: 'Comprehensive dashboard with profit/loss insights.',
        icon: (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        tags: ['Analytics', 'Insights'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },
    {
        title: 'Anomaly Detection System',
        description: 'Advanced system to detect anomalies in data and notify you instantly.',
        icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        tags: ['Security', 'Alerts'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },

    {
        title: 'Inventory Management',
        description: 'Real-time tracking of stock levels across multiple locations. Includes shipment logistics to track deliveries and manage routes efficiently.',
        icon: (
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
        ),
        tags: ['Real-time', 'Stock', 'Logistics'],
        className: 'md:col-span-2 lg:col-span-1 lg:row-span-2',
        bgPattern: true
    },



    {
        title: 'RAG Implementation',
        description: 'Retrieval-Augmented Generation for context-aware AI responses based on your data.',
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        tags: ['AI', 'Context'],
        className: 'md:col-span-1 lg:col-span-2',
        bgPattern: false
    },
    {
        title: 'XML to JSON',
        description: 'Convert XML invoices and documents to structured JSON format with a single click for easy processing and integration.',
        icon: (
            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        tags: ['Conversion', 'Data'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },
    {
        title: 'Local LLM Implementation',
        description: 'Option to run LLMs locally for enhanced privacy and data security.',
        icon: (
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
        ),
        tags: ['Privacy', 'Offline'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },
    {
        title: 'System Status Health Check',
        description: 'Real-time monitoring of all connected services — MongoDB, Gemini AI, and Twilio — with live health indicators.',
        icon: (
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        tags: ['Monitoring', 'Live'],
        className: 'md:col-span-1 lg:col-span-1',
        bgPattern: false
    },

];

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8 animate-fadeInUp flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md border border-gray-100">
                        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                            <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
                            <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">IppoScan <span className="text-emerald-500">Features</span></h1>
                </div>

                <a
                    href="https://github.com/Jayanthram7/Docusense-AI/blob/main/document_intelligence_supply_chain_app_44a6e1a0.plan.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-900 transition-all shadow-md group border border-gray-800"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">View Project Architecture</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            {/* Bento Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`
              relative group overflow-hidden bg-white rounded-2xl border shadow-sm border-gray-200 p-6
              hover:shadow-lg hover:border-green-500 transition-all duration-300
              flex flex-col justify-between
              ${feature.className}
              animate-fadeInUp opacity-0
            `}
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                        {/* Dot Pattern Background for larger cards */}
                        {feature.bgPattern && (
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            />
                        )}

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300
                `}>
                                    {feature.icon}
                                </div>
                                {feature.tags && (
                                    <div className="flex gap-2">
                                        {feature.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-sm text-gray-500 leading-relaxed max-w-[90%] group-hover:text-black transition-colors">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Footer */}
            <footer className="mt-20 border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
                    {/* Left Column - Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md border border-gray-100">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
                                    <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">IppoScan</span>
                        </div>
                        <p className="text-gray-500 max-w-xs leading-relaxed">
                            The intelligent platform for modern logistics, inventory, and invoice management.
                        </p>
                        <div className="flex gap-4 mt-2">
                            {/* Social Icons Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-500 transition-colors cursor-pointer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-500 transition-colors cursor-pointer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Team & Links */}
                    <div className="flex flex-wrap gap-12 md:gap-24">
                        {/* Team Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-emerald-500 uppercase tracking-wider text-sm">Team</h3>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                                <ul className="flex flex-col gap-3">
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Jayanthram K</li>
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Agilan ED</li>
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Gokul T</li>
                                </ul>
                                <ul className="flex flex-col gap-3">
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Harsha Ram A</li>
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Sakthivel S</li>
                                    <li className="text-gray-600 font-medium hover:text-emerald-600 cursor-pointer transition-colors">Kishor G</li>
                                </ul>
                            </div>
                        </div>

                        {/* Product Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-bold text-emerald-500 uppercase tracking-wider text-sm">Product</h3>
                            <ul className="flex flex-col gap-3">
                                <li><a href="/features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a></li>
                                <li><a href="/dashboard" className="text-gray-600 hover:text-emerald-600 transition-colors">Dashboard</a></li>
                                <li><a href="https://github.com/StartVisionPro/Docusense-AI" className="text-gray-600 hover:text-emerald-600 transition-colors">Architecture</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
