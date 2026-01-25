'use client';

import { useState, useEffect } from 'react';

interface GodownItem {
    _id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
}

interface ShipmentItem {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
}

interface ShipmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ShipmentModal({ isOpen, onClose, onSuccess }: ShipmentModalProps) {
    const [godownItems, setGodownItems] = useState<GodownItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<ShipmentItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        shipmentDate: new Date().toISOString().split('T')[0],
        driverName: '',
        vehicleNumber: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchGodownItems();
        }
    }, [isOpen]);

    const fetchGodownItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/inventory/godown-items');
            if (response.ok) {
                const data = await response.json();
                setGodownItems(data);
            }
        } catch (error) {
            console.error('Error fetching godown items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const itemId = e.target.value;
        if (!itemId) return;

        const item = godownItems.find(i => i._id === itemId);
        if (item && !selectedItems.find(i => i.itemId === itemId)) {
            setSelectedItems([...selectedItems, {
                itemId: item._id,
                itemName: item.item_name,
                quantity: 1,
                unitPrice: item.unit_price || 0
            }]);
        }
        e.target.value = '';
    };

    const updateItemQuantity = (index: number, quantity: number) => {
        const newItems = [...selectedItems];
        const item = godownItems.find(i => i._id === newItems[index].itemId);

        if (item && quantity <= item.quantity && quantity > 0) {
            newItems[index].quantity = quantity;
            setSelectedItems(newItems);
        } else if (quantity <= 0) {
            newItems[index].quantity = quantity;
            setSelectedItems(newItems);
        }
    };

    const removeItem = (index: number) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            alert('Please select at least one item');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('/api/shipments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: selectedItems,
                    status: 'In Transit',
                    created_at: new Date()
                }),
            });

            if (response.ok) {
                onSuccess();
                onClose();
                setFormData({
                    origin: '',
                    destination: '',
                    shipmentDate: new Date().toISOString().split('T')[0],
                    driverName: '',
                    vehicleNumber: '',
                });
                setSelectedItems([]);
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to create shipment');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            alert('Error creating shipment');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col m-4">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                        </div>
                        Create New Shipment
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Route Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Origin City</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="e.g., Chennai"
                                value={formData.origin}
                                onChange={e => setFormData({ ...formData, origin: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Destination City</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="e.g., Bangalore"
                                value={formData.destination}
                                onChange={e => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Shipment Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                value={formData.shipmentDate}
                                onChange={e => setFormData({ ...formData, shipmentDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Driver Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Optional"
                                value={formData.driverName}
                                onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Vehicle Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                placeholder="Optional"
                                value={formData.vehicleNumber}
                                onChange={e => setFormData({ ...formData, vehicleNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Item Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">Shipment Items</h3>
                            <div className="relative w-64">
                                <select
                                    onChange={handleAddItem}
                                    className="w-full pl-4 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select item to add...</option>
                                    {godownItems.map(item => (
                                        <option key={item._id} value={item._id} disabled={selectedItems.some(i => i.itemId === item._id)}>
                                            {item.item_name} (Avail: {item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-4 text-gray-500">Loading inventory...</div>
                        ) : selectedItems.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                <p className="text-gray-500 text-sm">No items selected</p>
                                <p className="text-xs text-gray-400 mt-1">Select items from the dropdown above</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedItems.map((item, index) => {
                                    const maxQty = godownItems.find(i => i._id === item.itemId)?.quantity || 0;
                                    return (
                                        <div key={item.itemId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.itemName}</p>
                                                <p className="text-xs text-gray-500">Max available: {maxQty}</p>
                                            </div>
                                            <div className="w-32">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={maxQty}
                                                    value={item.quantity}
                                                    onChange={e => updateItemQuantity(index, parseInt(e.target.value))}
                                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-emerald-500"
                                                    placeholder="Qty"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || selectedItems.length === 0}
                        className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {submitting ? (
                            <>Creating...</>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Shipment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
