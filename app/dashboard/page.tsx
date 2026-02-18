"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../components/Footer';

interface DashboardData {
  totalInvoices: number;
  anomaliesDetected: number;
  totalProfit: number;
  inventoryItems: number;
  monthlyData: Array<{ month: string; purchases: number; sales: number }>;
}

interface CustomerData {
  totalCustomers: number;
  newThisMonth: number;
  returningCustomersPercent: number;
  lifetimeValue: number;
  customers: Array<{
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    status: string;
    joined: string;
  }>;
}

interface SupplierData {
  totalSuppliers: number;
  newThisMonth: number;
  returningPercent: number;
  lifetimeValue: number;
  suppliers: Array<{
    name: string;
    email: string;
    orders: number;
    totalSpent: number;
    status: string;
    joined: string;
  }>;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<DashboardData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, customerRes, supplierRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/customers'),
          fetch('/api/suppliers')
        ]);

        const dashboardResult = await dashboardRes.json();
        const customerResult = await customerRes.json();
        const supplierResult = await supplierRes.json();

        if (dashboardResult.success) {
          setData(dashboardResult);
        }
        if (customerResult.success) {
          setCustomerData(customerResult);
        }
        if (supplierResult.success) {
          setSupplierData(supplierResult);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate total revenue from monthly sales data
  const totalRevenue = data?.monthlyData?.reduce((sum, month) => sum + month.sales, 0) || 0;

  // Handle tab click
  const handleTabClick = (tab: string) => {
    if (tab === 'Orders') {
      router.push('/invoices');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-gray-900">
      {/* Top Header / Navbar Area */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 gap-4">
        <div className="flex items-center gap-2">
          <button className="md:hidden p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center Pill Navigation */}
        <nav className="flex items-center gap-1 bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
          {['Dashboard', 'Customers', 'Suppliers', 'Orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab
                ? 'bg-emerald-200 text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
            >
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fadeInUp origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">Project so good , it deserves 10/10</p>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors p-1"
            >
              <img src="https://i.pravatar.cc/100?img=12" alt="Admin" className="w-9 h-9 rounded-full object-cover" />
              <div className="leading-tight hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">Jayanthram K</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <svg className={`w-4 h-4 text-gray-400 hidden md:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeInUp origin-top-right">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900">Signed in as</p>
                  <p className="text-xs text-gray-500 truncate">jayanthram@ipposcan.com</p>
                </div>
                <button
                  onClick={() => router.push('/')}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-3 px-6 pb-6 max-w-[1400px] mx-auto space-y-6">

        {/* Conditional Content Based on Active Tab */}
        {activeTab === 'Dashboard' && (
          <>
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Welcome, Jayanthram K <span className="text-3xl">👋</span>
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">An overview of customer insights, sales performance, and revenue analytics.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  This Week
                </button>
                <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Revenue"
                value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change="+12.5%"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <MetricCard
                label="Total Orders"
                value={data?.totalInvoices?.toString() || '0'}
                change="+8.2%"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
              />
              <MetricCard
                label="Anomalies Detected"
                value={data?.anomaliesDetected?.toString() || '0'}
                change="-2.4%"
                isNegative
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              />
              <MetricCard
                label="Inventory Items"
                value={data?.inventoryItems?.toString() || '0'}
                change="+5.1%"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
            </div>

            {/* Charts and Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Section */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Total Profit Overview</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-bold text-gray-900">${data?.totalProfit?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</span>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+8.4%</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                  </button>
                </div>

                {/* Simple CSS Bar Chart */}
                <div className="h-52 mt-4 flex items-end justify-between gap-2">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Loading chart...</div>
                  ) : (
                    data?.monthlyData?.map((monthData, i) => {
                      // Fixed Y-axis maximum at $5000, chart height is 208px (h-52 = 13rem = 208px)
                      const yAxisMax = 5000;
                      const chartHeightPx = 208;

                      // Calculate heights in pixels based on fixed scale
                      const salesHeightPx = Math.min(chartHeightPx, (monthData.sales / yAxisMax) * chartHeightPx);
                      const purchasesHeightPx = Math.min(chartHeightPx, (monthData.purchases / yAxisMax) * chartHeightPx);

                      return (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                          <div className="w-full flex items-end justify-center gap-0.5 group relative" style={{ height: '208px' }}>
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                Sales: ${monthData.sales.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                                Purchases: ${monthData.purchases.toLocaleString()}
                              </div>
                            </div>
                            {/* Purchases Bar (Orange) */}
                            <div
                              className="w-[45%] rounded-t transition-all duration-300 bg-orange-500 hover:bg-orange-600 self-end"
                              style={{ height: `${purchasesHeightPx}px` }}
                            />
                            {/* Sales Bar (Blue) */}
                            <div
                              className="w-[45%] rounded-t transition-all duration-300 bg-blue-500 hover:bg-blue-600 self-end"
                              style={{ height: `${salesHeightPx}px` }}
                            />
                          </div>
                          <span className="text-[10px] text-center text-gray-400 mt-1">{monthData.month}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-100"></span>
                    <span className="text-gray-500">Purchases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-gray-500">Sales</span>
                  </div>
                  <div className="ml-auto flex items-center gap-3 text-gray-400">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
                      Shopify
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" /></svg>
                      Amazon
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
                <h3 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { type: 'upload', title: 'Invoice Uploaded', detail: 'INV-2024-001.pdf', time: '2 hours ago', color: 'blue' },
                    { type: 'alert', title: 'Anomaly Detected', detail: 'Unusual pricing pattern', time: '5 hours ago', color: 'red' },
                    { type: 'check', title: 'Invoice Processed', detail: 'INV-2024-002.pdf', time: '1 day ago', color: 'green' },
                    { type: 'upload', title: 'Invoice Uploaded', detail: 'INV-2024-003.pdf', time: '2 days ago', color: 'blue' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color === 'blue' ? 'bg-blue-100' : activity.color === 'red' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                        {activity.type === 'upload' && (
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        )}
                        {activity.type === 'alert' && (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        {activity.type === 'check' && (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Customers Tab Content */}
        {activeTab === 'Customers' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
                <p className="text-gray-500 text-sm mt-0.5">Manage and view your customer base.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Customer
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Customers</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{customerData?.totalCustomers?.toLocaleString() || '0'}</div>
                <div className="text-xs text-green-600 mt-1">+1.8% WoW</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">New This Month</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{customerData?.newThisMonth || '0'}</div>
                <div className="text-xs text-green-600 mt-1">+12.4% vs last month</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Returning Customers</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{customerData?.returningCustomersPercent || '0'}%</div>
                <div className="text-xs text-green-600 mt-1">+21% vs last month</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Avg. Lifetime Value</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">${customerData?.lifetimeValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <div className="text-xs text-green-600 mt-1">+5.8% vs last month</div>
              </div>
            </div>

            {/* Customer Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Customer Segments Sidebar */}
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Customer Segments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm text-gray-700">VIP Customers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">234</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '5.5%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-700">Active Customers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">2845</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '66.8%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-700">New Customers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">892</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '20.9%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-sm text-gray-700">Inactive Customers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">292</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '6.8%' }}></div>
                  </div>
                </div>
              </div>

              {/* All Customers Table */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">All Customers</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-400">Loading customers...</td>
                        </tr>
                      ) : customerData?.customers && customerData.customers.length > 0 ? (
                        customerData.customers.map((customer, i) => {
                          const initials = customer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          const statusColor = customer.totalSpent > 5000 ? 'yellow' : 'green';
                          const displayStatus = customer.totalSpent > 5000 ? 'VIP' : customer.status;

                          return (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                                    <div className="text-xs text-gray-500">{customer.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {displayStatus}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-900">{customer.orders}</td>
                              <td className="px-5 py-4 text-sm font-semibold text-gray-900">${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-5 py-4 text-sm text-gray-500">{customer.joined}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No customers found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suppliers Tab Content */}
        {activeTab === 'Suppliers' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
                <p className="text-gray-500 text-sm mt-0.5">Manage and view your supplier base.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Supplier
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Suppliers</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{supplierData?.totalSuppliers?.toLocaleString() || '0'}</div>
                <div className="text-xs text-green-600 mt-1">+2.1% WoW</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">New This Month</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{supplierData?.newThisMonth || '0'}</div>
                <div className="text-xs text-green-600 mt-1">+8.3% vs last month</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Returning Suppliers</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{supplierData?.returningPercent || '0'}%</div>
                <div className="text-xs text-green-600 mt-1">+15% vs last month</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Purchase Value</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">${supplierData?.lifetimeValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                <div className="text-xs text-green-600 mt-1">+4.2% vs last month</div>
              </div>
            </div>

            {/* Supplier Table */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Supplier Segments Sidebar */}
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Supplier Segments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-sm text-gray-700">Premium Suppliers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">156</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '8.2%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm text-gray-700">Active Suppliers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">1523</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '72.5%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm text-gray-700">New Suppliers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">312</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '14.8%' }}></div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="text-sm text-gray-700">Inactive Suppliers</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">109</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-gray-300 h-1.5 rounded-full" style={{ width: '4.5%' }}></div>
                  </div>
                </div>
              </div>

              {/* All Suppliers Table */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">All Suppliers</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search suppliers..."
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Supplier</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Orders</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Spent</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-400">Loading suppliers...</td>
                        </tr>
                      ) : supplierData?.suppliers && supplierData.suppliers.length > 0 ? (
                        supplierData.suppliers.map((supplier, i) => {
                          const initials = supplier.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          const statusColor = supplier.totalSpent > 10000 ? 'purple' : 'green';
                          const displayStatus = supplier.totalSpent > 10000 ? 'Premium' : supplier.status;

                          return (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">{supplier.name}</div>
                                    <div className="text-xs text-gray-500">{supplier.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                  {displayStatus}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-sm text-gray-900">{supplier.orders}</td>
                              <td className="px-5 py-4 text-sm font-semibold text-gray-900">${supplier.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              <td className="px-5 py-4 text-sm text-gray-500">{supplier.joined}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-gray-400">No suppliers found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer className="bg-[#F8F7F4]" />
    </div>
  );
}

// MetricCard Component
function MetricCard({ label, value, change, isNegative = false, icon }: { label: string; value: string; change: string; isNegative?: boolean; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</span>
        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
          <div className="text-emerald-600">{icon}</div>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className={`text-xs font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>{change} vs last week</div>
    </div>
  );
}