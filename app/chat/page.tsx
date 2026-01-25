'use client';

import { ChatInterface } from '@/components/ChatInterface';
import { useEffect } from 'react';

export default function ChatPage() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-8 py-6 bg-[#F8F7F4] h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* IppoScan logo */}
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-md">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Up-Right Arrow */}
              <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
              {/* Down-Left Arrow */}
              <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              IppoScan <span className="text-emerald-600">AI</span>
            </h1>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
              Powered by AI
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">Ask questions about your invoices, inventory, and business insights</p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div >
  );
}
