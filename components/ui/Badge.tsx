import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function ValidationBadge({ status }: { status: string }) {
  const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
    'Valid': { label: 'Valid', variant: 'success' },
    'Needs Review': { label: 'Needs Review', variant: 'warning' },
    'Potential Fraud': { label: 'Potential Fraud', variant: 'danger' },
  };
  
  const config = statusMap[status] || { label: status, variant: 'default' };
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

