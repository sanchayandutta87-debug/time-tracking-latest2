import React from 'react';
import { Eye, Calendar, Mail, DollarSign } from 'lucide-react';
import { Invoice } from '../types/invoice';

interface InvoiceGridViewProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceGridView({ invoices, onViewInvoice }: InvoiceGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {invoices.map((invoice, index) => (
        <div key={`${invoice.id}-${index}`} className="bg-white dark:bg-black rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-50 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={invoice.avatar} alt={invoice.name} className="w-12 h-12 rounded-xl border border-gray-100 dark:border-gray-800 object-cover" referrerPolicy="no-referrer" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  invoice.status === 'Paid' ? 'bg-green-500' : 
                  invoice.status === 'Overdue' ? 'bg-red-500' : 
                  'bg-blue-500'
                }`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight group-hover:text-blue-600 transition-colors">{invoice.name}</h3>
                <p className="text-xs text-gray-400">{invoice.email}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-4 flex-grow">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar size={14} /> Issued: {invoice.createdOn.split(',')[0]}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                invoice.status === 'Paid' ? 'bg-green-50 text-green-500' : 
                invoice.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 
                'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
              }`}>
                {invoice.status}
              </span>
            </div>

            <div className="bg-white dark:bg-black/50 rounded-xl p-4 flex justify-between items-center border border-gray-50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Invoice ID</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{invoice.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Due Date</p>
                <p className="font-bold text-gray-800 dark:text-white text-sm">{invoice.dueDate}</p>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Final Amount</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">${invoice.finalAmount.toLocaleString()}</p>
              </div>
              {invoice.amountDue > 0 && (
                <div className="text-right">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Amount Due</p>
                  <p className="text-lg font-black text-red-500">${invoice.amountDue.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 bg-white dark:bg-black/50 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <button 
              onClick={() => onViewInvoice && onViewInvoice(invoice)}
              className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl hover:bg-blue-50 dark:bg-blue-900/20 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center justify-center gap-2"
            >
              <Eye size={14} /> View Bill
            </button>
            <button className="w-10 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-400 rounded-xl hover:bg-white dark:bg-black transition-all flex items-center justify-center">
              <Mail size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
