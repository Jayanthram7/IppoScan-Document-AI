'use client';

import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 text-gray-900 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Up-Right Arrow */}
              <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
              {/* Down-Left Arrow */}
              <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">IppoScan</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6">
        <div className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          MENU
        </div>
        <SidebarLink href="/dashboard" icon="dashboard" isActive={isActive('/dashboard')}>
          Dashboard
        </SidebarLink>
        <SidebarLink href="/invoices" icon="invoices" isActive={isActive('/invoices')}>
          Invoices (Orders)
        </SidebarLink>
        <SidebarLink href="/inventory/shipment" icon="shipment" isActive={isActive('/inventory/shipment')}>
          Shipment
        </SidebarLink>
        <InventorySubmenu isActive={isActive} />
        <Link
          href="/chat"
          className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium ${isActive('/chat')
            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
          <div className="w-7 h-7 bg-white rounded flex items-center justify-center p-1 shadow-md border border-emerald-500">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
              <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
            </svg>
          </div>
          <span className="text-sm flex-1">
            <span className={isActive('/chat') ? 'text-white' : 'text-emerald-600'}>IppoScan</span> Chat
          </span>
          <div className="px-2 py-0.5 bg-emerald-500 rounded text-white text-[10px] font-semibold">
            New
          </div>
        </Link>
        <a
          href="https://console.twilio.com/?frameUrl=/console"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        >
          <SidebarIcon type="whatsapp" />
          <span className="text-sm">WhatsApp (Twilio)</span>
          <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <a
          href="https://github.com/Jayanthram7/Docusense-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        >
          <SidebarIcon type="github" />
          <span className="text-sm">GitHub</span>
          <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <SidebarLink href="/features" icon="features" isActive={isActive('/features')}>
          Features
        </SidebarLink>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-100">

        <div className="px-3 py-2 mt-2 mb-1">
          <p className="text-xs text-gray-400 font-medium">Signed in as</p>
          <p className="text-sm font-bold text-gray-700 truncate">Jayanthram K</p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium text-gray-500 hover:bg-red-50 hover:text-red-600"
        >
          <SidebarIcon type="logout" />
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}

function InventorySubmenu({ isActive }: { isActive: (path: string) => boolean }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const pathname = usePathname();

  // Auto-open if any inventory sub-route is active
  React.useEffect(() => {
    if (pathname?.startsWith('/inventory')) {
      setIsOpen(true);
    }
  }, [pathname]);

  const isInventoryActive = pathname?.startsWith('/inventory') || false;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium ${isInventoryActive
          ? 'bg-emerald-50 text-emerald-600'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <div className="flex items-center gap-3">
          <SidebarIcon type="inventory" />
          <span className="text-sm">Inventory</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="ml-8 mt-1 space-y-1 animate-slideIn border-l border-gray-200 pl-3">
          <Link
            href="/inventory/source"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive('/inventory/source')
              ? 'text-emerald-600 font-medium bg-emerald-50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Source (Purchases)
          </Link>
          <Link
            href="/inventory/delivered"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive('/inventory/delivered')
              ? 'text-emerald-600 font-medium bg-emerald-50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Delivered (Sales)
          </Link>
          <Link
            href="/inventory/in-godown"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive('/inventory/in-godown')
              ? 'text-emerald-600 font-medium bg-emerald-50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Godown (Stock)
          </Link>
        </div>
      )}
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  children,
  isActive
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ease-in-out font-medium ${isActive
        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
    >
      <SidebarIcon type={icon} />
      <span className="text-sm">{children}</span>
    </Link>
  );
}

function SidebarIcon({ type }: { type: string }) {
  const icons: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    invoices: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    inventory: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    chat: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    settings: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    shipment: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    whatsapp: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    ),
    features: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  if (isLandingPage) {
    return (
      <html lang="en" className="no-scrollbar">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="no-scrollbar">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            <footer className="flex-shrink-0 py-2 px-8">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-4 h-4 bg-white rounded flex items-center justify-center p-0.5 shadow-sm">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
                    <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
                  </svg>
                </div>
                <span>© IppoScan 2026. All rights reserved.</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
