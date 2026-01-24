'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './ui/Card';

interface DashboardStats {
  totalInvoices: number;
  anomaliesDetected: number;
  supplierSpend: Array<{ name: string; total: number }>;
  recentInventoryUpdates: number;
  totalProfit?: number;
  inventoryItems?: number;
  monthlyData?: Array<{ month: string; purchases: number; sales: number }>;
}

interface ActivityItem {
  supplier: string;
  amount: number;
  time: string;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    anomaliesDetected: 0,
    supplierSpend: [],
    recentInventoryUpdates: 0,
    totalProfit: 0,
    inventoryItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const data = await response.json();
        if (data.invoices && Array.isArray(data.invoices)) {
          const activities = data.invoices.slice(0, 4).map((inv: any) => ({
            supplier: inv.supplier_name || 'Unknown',
            amount: parseFloat(inv.structured_data?.grand_total || '0'),
            time: getTimeAgo(new Date(inv.created_at)),
          }));
          setRecentActivity(activities);
        }
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const maxSpend = Math.max(...stats.supplierSpend.map(s => s.total), 1);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">Real-time</span>
          </div>
          <p className="text-gray-600 mt-2">Track your invoices, inventory, and business insights in real-time</p>
        </div>
        <a
          href="/invoices"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg font-medium"
        >
          + Add Invoice
        </a>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Invoices */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl cursor-pointer animate-fadeInUp" style={{ animationDelay: '0ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>

        {/* Anomalies Detected */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl cursor-pointer animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Anomalies Detected</p>
              <p className="text-3xl font-bold text-gray-900">{stats.anomaliesDetected}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-green-600">+2% from last month</p>
        </div>

        {/* Total Profit */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl cursor-pointer animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className={`text-3xl font-bold ${(stats.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{(stats.totalProfit || 0).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${(stats.totalProfit || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg transition-all duration-300 group-hover:scale-110`}>
              <svg className={`w-6 h-6 ${(stats.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {(stats.totalProfit || 0) >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
            </div>
          </div>
          <p className={`text-sm ${(stats.totalProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Sales - Orders
          </p>
        </div>

        {/* Inventory Items */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-xl cursor-pointer animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inventory Items</p>
              <p className="text-3xl font-bold text-gray-900">{stats.inventoryItems || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600">Items in godown</p>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Purchase vs Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Yearly Purchase vs Sales</h2>
          </div>

          <MonthlyBarChart monthlyData={stats.monthlyData || []} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl animate-fadeInUp" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Updated 1 sec ago</span>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 transition-all duration-200 hover:translate-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">New invoice processed</p>
                  <p className="text-sm text-gray-600 truncate">{activity.supplier} - ₹{activity.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div >
    </div >
  );
}

// Monthly Bar Chart Component
function MonthlyBarChart({ monthlyData }: { monthlyData: Array<{ month: string; purchases: number; sales: number }> }) {
  const [hoveredBar, setHoveredBar] = useState<{ month: string; type: 'purchases' | 'sales'; value: number } | null>(null);

  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  // Fill in missing months with zero values
  const completeData = months.map(month => {
    const existing = monthlyData.find(d => d.month === month);
    return existing || { month, purchases: 0, sales: 0 };
  });

  const maxValue = Math.max(
    ...completeData.map(d => Math.max(d.purchases, d.sales)),
    1
  );

  return (
    <div className="relative">
      {/* Hover tooltip */}
      {hoveredBar && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-10 whitespace-nowrap">
          {hoveredBar.month} - {hoveredBar.type === 'purchases' ? 'Purchases' : 'Sales'}: ₹{hoveredBar.value.toLocaleString()}
        </div>
      )}

      {/* Chart */}
      <div className="flex items-end justify-between gap-2 h-64 mt-8">
        {completeData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            {/* Sales bar */}
            <div
              className="w-full bg-green-500 rounded-t cursor-pointer hover:bg-green-600 transition-all duration-200 ease-in-out transform hover:scale-105 relative"
              style={{ height: `${(data.sales / maxValue) * 100}%`, minHeight: data.sales > 0 ? '4px' : '0' }}
              onMouseEnter={() => setHoveredBar({ month: data.month, type: 'sales', value: data.sales })}
              onMouseLeave={() => setHoveredBar(null)}
            />
            {/* Purchases bar */}
            <div
              className="w-full bg-blue-500 rounded-t cursor-pointer hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 relative"
              style={{ height: `${(data.purchases / maxValue) * 100}%`, minHeight: data.purchases > 0 ? '4px' : '0' }}
              onMouseEnter={() => setHoveredBar({ month: data.month, type: 'purchases', value: data.purchases })}
              onMouseLeave={() => setHoveredBar(null)}
            />
            {/* Month label */}
            <span className="text-xs text-gray-600 mt-2">{data.month}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Purchases</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Sales</span>
        </div>
      </div>
    </div>
  );
}
