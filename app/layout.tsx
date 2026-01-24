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
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
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
          Invoices
        </SidebarLink>
        <InventorySubmenu isActive={isActive} />
        <SidebarLink href="/chat" icon="chat" isActive={isActive('/chat')}>
          AI Assistant
        </SidebarLink>
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-100">
        <SidebarLink href="/settings" icon="settings" isActive={isActive('/settings')}>
          Settings
        </SidebarLink>
        <SidebarLink href="/logout" icon="logout" isActive={false}>
          Logout
        </SidebarLink>
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
            Source (Orders)
          </Link>
          <Link
            href="/inventory/transit"
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive('/inventory/transit')
              ? 'text-emerald-600 font-medium bg-emerald-50'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Transit
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 ml-64">
            {children}
            <footer className="mt-auto py-6 text-center text-sm text-gray-500 border-t border-gray-100 mx-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center text-sm text-gray-600">
                  <p>&copy; IppoScan 2026</p>
                </div>
                <p className="flex items-center gap-1">
                  Made in India <span className="text-red-500 animate-pulse">❤️</span>
                </p>
              </div>
            </footer>
          </main>
        </div>
      </body>
    </html>
  );
}
