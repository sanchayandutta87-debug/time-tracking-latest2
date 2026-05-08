import React from 'react';
import { MoreVertical } from 'lucide-react';

const invoices = [
  { id: 'INV-1454', name: 'Anthony Lewis', email: 'anthony@example.com', createdOn: '14 Jan 2024, 04:27 AM', total: '$300', amountDue: '$0', dueDate: '14 Jan 2024, 04:27 AM', status: 'Paid', avatar: 'https://picsum.photos/seed/anthony/40/40' },
  { id: 'INV-6571', name: 'Brian Villalobos', email: 'brian@example.com', createdOn: '21 Jan 2024, 03:19 AM', total: '$547', amountDue: '$200', dueDate: '21 Jan 2024, 03:19 AM', status: 'Overdue', avatar: 'https://picsum.photos/seed/brian/40/40' },
  { id: 'INV-2245', name: 'Harvey Smith', email: 'harvey@example.com', createdOn: '20 Feb 2024, 12:15 PM', total: '$325', amountDue: '$65', dueDate: '20 Feb 2024, 12:15 PM', status: 'Pending', avatar: 'https://picsum.photos/seed/harvey/40/40' },
  { id: 'INV-1456', name: 'Stephan Peralt', email: 'peral@example.com', createdOn: '15 Mar 2024, 12:11 AM', total: '$471', amountDue: '$145', dueDate: '15 Mar 2024, 12:11 AM', status: 'Pending', avatar: 'https://picsum.photos/seed/stephan/40/40' },
  { id: 'INV-0045', name: 'Doglas Martini', email: 'martniwr@example.com', createdOn: '12 Apr 2024, 05:48 PM', total: '$147', amountDue: '$32', dueDate: '12 Apr 2024, 05:48 PM', status: 'Overdue', avatar: 'https://picsum.photos/seed/doglas/40/40' },
  { id: 'INV-6244', name: 'Linda Ray', email: 'linda@example.com', createdOn: '20 Apr 2024, 06:11 PM', total: '$654', amountDue: '$140', dueDate: '20 Apr 2024, 06:11 PM', status: 'Draft', avatar: 'https://picsum.photos/seed/linda/40/40' },
  { id: 'INV-9565', name: 'Elliot Murray', email: 'murray@example.com', createdOn: '14 Jan 2024, 04:27 AM', total: '$300', amountDue: '$0', dueDate: '14 Jan 2024, 04:27 AM', status: 'Paid', avatar: 'https://picsum.photos/seed/elliot/40/40' },
  { id: 'INV-6874', name: 'Rebecca Smtih', email: 'smtih@example.com', createdOn: '02 Sep 2024, 09:21 PM', total: '$654', amountDue: '$65', dueDate: '02 Sep 2024, 09:21 PM', status: 'Paid', avatar: 'https://picsum.photos/seed/rebecca/40/40' },
  { id: 'INV-6587', name: 'Connie Waters', email: 'connie@example.com', createdOn: '15 Nov 2024, 12:44 PM', total: '$987', amountDue: '$47', dueDate: '15 Nov 2024, 12:44 PM', status: 'Pending', avatar: 'https://picsum.photos/seed/connie/40/40' },
  { id: 'INV-5879', name: 'Lori Broaddus', email: 'broaddus@example.com', createdOn: '10 Dec 2024, 11:23 PM', total: '$365', amountDue: '$21', dueDate: '10 Dec 2024, 11:23 PM', status: 'Overdue', avatar: 'https://picsum.photos/seed/lori/40/40' },
];

export default function InvoicesTable({ invoices = [], onRowClick }: { invoices: any[], onRowClick: (invoice: any) => void }) {
  if (invoices.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-gray-400 italic">No invoices found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
          <tr>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Invoice</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Customer</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Created On</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Total</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Amount Due</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Due Date</th>
            <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-sm">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr 
              key={invoice.id} 
              onClick={() => onRowClick(invoice)}
              className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group cursor-pointer"
            >
              <td className="p-4 text-gray-600 dark:text-gray-400 text-sm font-medium">{invoice.invoice_number}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={invoice.customer_avatar} alt={invoice.customer_name} className="w-9 h-9 rounded-full border border-gray-100 dark:border-gray-800" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-white text-sm">{invoice.customer_name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{invoice.customer_email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(invoice.created_at).toLocaleDateString()}</td>
              <td className="p-4 text-gray-600 dark:text-gray-300 text-sm font-medium">${invoice.total_amount.toLocaleString()}</td>
              <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">${invoice.amount_due.toLocaleString()}</td>
              <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{new Date(invoice.due_date).toLocaleDateString()}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  invoice.status === 'Paid' ? 'bg-green-50 dark:bg-green-900/20 text-green-500' : 
                  invoice.status === 'Overdue' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 
                  invoice.status === 'Pending' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 
                  'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                  <MoreVertical size={16} className="text-gray-400 dark:text-gray-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
