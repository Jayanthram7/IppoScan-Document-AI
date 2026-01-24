import { ChatInterface } from '@/components/ChatInterface';

export default function ChatPage() {
  return (
    <div className="px-4 py-8 h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="text-gray-600 mt-2">Ask questions about your invoices and transactions</p>
      </div>
      <div className="h-full">
        <ChatInterface />
      </div>
    </div>
  );
}

