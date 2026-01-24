export interface InvoiceItem {
  item_name: string;
  quantity: string;
  unit_price: string;
  total_price: string;
}

export type InvoiceType = 'Purchase Invoice' | 'Purchase Order' | 'Sales Invoice' | 'Other';
export type InventoryStatus = 'Source' | 'In Travel' | 'Transit' | 'Delivered' | 'In Godown';

export interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  supplier_name: string;
  invoice_type: InvoiceType;
  raw_text: string;
  items: InvoiceItem[];
  subtotal: string;
  tax: string;
  grand_total: string;
  confidence_notes: string;
}

export interface ValidationIssue {
  field?: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  status: 'Valid' | 'Needs Review' | 'Potential Fraud';
  issues: ValidationIssue[];
}

export interface Invoice {
  _id?: string;
  invoice_number: string;
  invoice_date: string;
  supplier_name: string;
  invoice_type: InvoiceType;
  inventory_status: InventoryStatus;
  raw_text: string;
  structured_data: InvoiceData;
  validation_status: 'Valid' | 'Needs Review' | 'Potential Fraud';
  validation_issues: ValidationIssue[];
  embedding?: number[];
  file_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface Supplier {
  _id?: string;
  name: string;
  contact_info?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  total_spend: number;
  invoice_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceItemDocument {
  _id?: string;
  invoice_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: Date;
}

export interface Transaction {
  _id?: string;
  invoice_id: string;
  type: 'purchase' | 'inventory';
  amount: number;
  date: Date;
  embedding?: number[];
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface InventoryItem {
  _id?: string;
  item_name: string;
  quantity: number;
  last_updated: Date;
  source_invoice_id?: string;
  created_at: Date;
}

