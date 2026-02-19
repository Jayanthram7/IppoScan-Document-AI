'use client';

import React from 'react';

type Endpoint = {
    path: string;
    method: string;
    description: string;
    tags: string[];
};

const endpoints: Endpoint[] = [
    {
        path: '/api/chat',
        method: 'POST',
        description: 'Handles chat messages using RAG with Gemini to answer questions based on invoices, transactions, and inventory.',
        tags: ['AI', 'Chat'],
    },
    {
        path: '/api/customers',
        method: 'GET',
        description: 'Retrieves aggregated customer data including lifetime value, top customers, and retention metrics.',
        tags: ['Customers', 'Analytics'],
    },
    {
        path: '/api/dashboard',
        method: 'GET',
        description: 'Provides dashboard statistics: total invoices, anomalies, supplier spend, and inventory updates.',
        tags: ['Dashboard', 'Analytics'],
    },
    {
        path: '/api/evaluation',
        method: 'GET',
        description: 'Returns evaluation metrics for the AI system compared to traditional OCR and manual entry.',
        tags: ['AI', 'Evaluation'],
    },
    {
        path: '/api/invoices',
        method: 'GET',
        description: 'Fetches a list of the 100 most recent invoices.',
        tags: ['Invoices'],
    },
    {
        path: '/api/invoices',
        method: 'POST',
        description: 'Creates a new invoice, processes it with Gemini, updates inventory and transactions.',
        tags: ['Invoices', 'Transactions', 'Inventory'],
    },
    {
        path: '/api/invoices/[id]',
        method: 'GET',
        description: 'Retrieves a specific invoice by ID.',
        tags: ['Invoices'],
    },
    {
        path: '/api/invoices/[id]',
        method: 'PUT',
        description: 'Updates a specific invoice by ID.',
        tags: ['Invoices'],
    },
    {
        path: '/api/invoices/[id]',
        method: 'DELETE',
        description: 'Deletes a specific invoice by ID.',
        tags: ['Invoices'],
    },
    {
        path: '/api/inventory',
        method: 'GET',
        description: 'Fetches all inventory items sorted by name.',
        tags: ['Inventory'],
    },
    {
        path: '/api/inventory/godown-items',
        method: 'GET',
        description: 'Fetches inventory items specifically located in the Godown.',
        tags: ['Inventory', 'Godown'],
    },
    {
        path: '/api/debug-inventory',
        method: 'GET',
        description: 'Debug endpoint to check inventory state.',
        tags: ['Inventory', 'Debug'],
    },
    {
        path: '/api/repair-inventory',
        method: 'GET',
        description: 'Utility endpoint to repair inventory data inconsistencies.',
        tags: ['Inventory', 'Utility'],
    },
    {
        path: '/api/process',
        method: 'POST',
        description: 'Processes an uploaded invoice file: OCR, extraction, validation, and database storage.',
        tags: ['Invoices', 'AI', 'Processing'],
    },
    {
        path: '/api/shipments',
        method: 'GET',
        description: 'Retrieves a list of all shipments.',
        tags: ['Shipments'],
    },
    {
        path: '/api/shipments',
        method: 'POST',
        description: 'Creates a new shipment and updates inventory quantities.',
        tags: ['Shipments', 'Inventory'],
    },
    {
        path: '/api/suppliers',
        method: 'GET',
        description: 'Fetches a list of suppliers.',
        tags: ['Suppliers'],
    },
    {
        path: '/api/upload',
        method: 'POST',
        description: 'Handles file uploads, validates file type, and returns the file path.',
        tags: ['Upload', 'Utility'],
    },
    {
        path: '/api/validate',
        method: 'POST',
        description: 'Validates extraction data against defined rules.',
        tags: ['Validation', 'AI'],
    },
    {
        path: '/api/xml',
        method: 'GET',
        description: 'Retrieves all past XML to JSON conversions.',
        tags: ['XML', 'Utility'],
    },
    {
        path: '/api/xml',
        method: 'POST',
        description: 'Converts an uploaded XML file to JSON.',
        tags: ['XML', 'Utility'],
    },
    {
        path: '/api/xml/[id]',
        method: 'GET',
        description: 'Retrieves a specific XML conversion by ID.',
        tags: ['XML', 'Utility'],
    },
    {
        path: '/api/extract',
        method: 'POST',
        description: 'Extracts data from a given text or document.',
        tags: ['AI', 'Extraction'],
    }
];

export default function EndpointsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">API Endpoints</h1>
                <p className="text-gray-500">
                    Comprehensive list of all API routes available in the Docusense AI application.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Path</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Method</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">Tags</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {endpoints.map((endpoint, index) => (
                                <tr
                                    key={`${endpoint.path}-${endpoint.method}-${index}`}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <code className="text-sm font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                            {endpoint.path}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMethodColor(endpoint.method)}`}>
                                            {endpoint.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {endpoint.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {endpoint.tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function getMethodColor(method: string) {
    switch (method) {
        case 'GET':
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'POST':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'PUT':
            return 'bg-orange-50 text-orange-700 border-orange-200';
        case 'DELETE':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
    }
}
