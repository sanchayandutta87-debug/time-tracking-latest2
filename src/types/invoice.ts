export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  name: string;
  email: string;
  createdOn: string;
  items?: InvoiceItem[];
  subTotal?: number;
  discount?: number;
  notes?: string;
  total: number; // Base Amount (SubTotal - Discount)
  taxRate: number; // GST %
  taxAmount: number;
  finalAmount: number;
  amountDue: number;
  dueDate: string;
  status: 'Paid' | 'Overdue' | 'Pending' | 'Draft';
  avatar: string;
  transactionId?: string;
}
