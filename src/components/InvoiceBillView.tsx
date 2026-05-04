import React, { useState } from 'react';
import { ArrowLeft, Mail, Building, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Invoice } from '../types/invoice';

interface InvoiceBillViewProps {
  invoice: Invoice;
  onBack: () => void;
}

export default function InvoiceBillView({ invoice, onBack }: { invoice: any, onBack: () => void }) {
  const [isSent, setIsSent] = useState(false);
  
  // Map database fields to display fields
  const displayData = {
    id: invoice.invoice_number || invoice.id,
    name: invoice.customer_name || invoice.name,
    email: invoice.customer_email || invoice.email,
    finalAmount: invoice.total_amount || invoice.finalAmount || 0,
    dueDate: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : (invoice.dueDate || 'N/A'),
    createdOn: invoice.created_at ? new Date(invoice.created_at).toLocaleDateString() : (invoice.createdOn || 'N/A'),
    status: invoice.status,
    transactionId: invoice.transaction_id || invoice.transactionId || 'N/A',
    items: invoice.items || [],
    subTotal: invoice.sub_total || invoice.subTotal || invoice.total_amount || 0,
    taxRate: invoice.tax_rate || invoice.taxRate || 18,
    taxAmount: invoice.tax_amount || invoice.taxAmount || 0,
    notes: invoice.notes || 'Thank you for your business!',
    discount: invoice.discount || 0
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Invoice from CodeXConquer - ${displayData.id}`);
    const body = encodeURIComponent(
      `Hello ${displayData.name},\n\n` +
      `I hope you're doing well. Please find the details of your invoice below:\n\n` +
      `Invoice ID: ${displayData.id}\n` +
      `Amount Due: $${displayData.finalAmount.toFixed(2)}\n` +
      `Due Date: ${displayData.dueDate}\n\n` +
      `Status: ${displayData.status}\n\n` +
      `You can view the full bill in your dashboard.\n\n` +
      `Thank you for your business!\n\n` +
      `Best regards,\n` +
      `CodeXConquer Billing Team`
    );
    
    window.location.href = `mailto:${displayData.email}?subject=${subject}&body=${body}`;
    
    // Simulate UI feedback
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black/30 -m-8 p-8 overflow-y-auto">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto w-full print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 font-semibold transition-colors bg-white dark:bg-black px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <ArrowLeft size={18} /> Back to Invoices
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleSendEmail}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm font-medium transition-all ${
              isSent ? 'bg-green-50 text-green-600 border-green-200' : 'bg-white dark:bg-black text-gray-600 dark:text-gray-300 hover:bg-white dark:bg-black'
            }`}
          >
            {isSent ? <CheckCircle2 size={16} /> : <Mail size={16} />}
            {isSent ? 'Sent!' : 'Send Email'}
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="bg-white dark:bg-black p-12 max-w-4xl mx-auto w-full rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 print:shadow-none print:border-none print:p-0">
        {/* Header section */}
        <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                CX
              </div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">CodeXConquer</h1>
            </div>
            <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center gap-2"><Building size={14} /> 123 Business Avenue, Suite 100</p>
              <p className="flex items-center gap-2"><MapPin size={14} /> New York, NY 10001, USA</p>
              <p className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-blue-600 uppercase tracking-widest mb-2">Invoice</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">#{displayData.id}</p>
            <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800 inline-block text-left">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Issue Date:</span>
                <span className="text-gray-800 dark:text-white font-semibold">{displayData.createdOn}</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Due Date:</span>
                <span className="text-gray-800 dark:text-white font-semibold">{displayData.dueDate}</span>
                <span className="text-gray-500 dark:text-gray-400 font-medium">Ref No:</span>
                <span className="text-gray-800 dark:text-white font-semibold uppercase">{displayData.transactionId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Billed To</p>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{displayData.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{displayData.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Status</p>
            <span className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider ${
              displayData.status === 'Paid' ? 'bg-green-50 text-green-500 border border-green-100' : 
              displayData.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100' : 
              displayData.status === 'Pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500 border border-blue-100' : 
              'bg-yellow-50 text-yellow-500 border border-yellow-100'
            }`}>
              {displayData.status}
            </span>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <tr>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold text-center">Qty</th>
                <th className="p-4 font-bold text-right">Price</th>
                <th className="p-4 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayData.items && displayData.items.length > 0 ? (
                displayData.items.map((item: any, index: number) => (
                  <tr key={item.id || index} className="text-sm">
                    <td className="p-4 font-medium text-gray-800 dark:text-white">{item.description || 'Item Description'}</td>
                    <td className="p-4 text-center text-gray-600 dark:text-gray-300">{item.quantity}</td>
                    <td className="p-4 text-right text-gray-600 dark:text-gray-300">${item.price.toFixed(2)}</td>
                    <td className="p-4 text-right font-bold text-gray-800 dark:text-white">${item.total.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr className="text-sm">
                  <td className="p-4 font-medium text-gray-800 dark:text-white">Professional Services</td>
                  <td className="p-4 text-center text-gray-600 dark:text-gray-300">1</td>
                  <td className="p-4 text-right text-gray-600 dark:text-gray-300">${displayData.subTotal.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-gray-800 dark:text-white">${displayData.subTotal.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notes & Terms</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{displayData.notes}</p>
            </div>
          </div>
          <div className="w-1/3">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium">
                <span>Subtotal</span>
                <span>${displayData.subTotal.toFixed(2)}</span>
              </div>
              {displayData.discount > 0 && (
                <div className="flex justify-between text-red-500 font-medium">
                  <span>Extra Discount</span>
                  <span>-${displayData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500 dark:text-gray-400 font-medium">
                <span>Tax (GST {displayData.taxRate}%)</span>
                <span>${displayData.taxAmount.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 dark:text-white">Total Amount</span>
                  <span className="text-2xl font-black text-blue-600">${displayData.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
          <p>Thank you for your business!</p>
          <p className="mt-1">If you have any questions about this invoice, please contact support at billing@codexconquer.com</p>
        </div>
      </div>
    </div>
  );
}
