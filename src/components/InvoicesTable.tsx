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

export default function InvoicesTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-700 text-sm">Invoice</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Customer</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Created On</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Total</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Amount Due</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Due Date</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={`${invoice.id}-${index}`} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
              <td className="p-4 text-gray-600 text-sm font-medium">{invoice.id}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <img src={invoice.avatar} alt={invoice.name} className="w-9 h-9 rounded-full border border-gray-100" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{invoice.name}</p>
                    <p className="text-xs text-gray-400">{invoice.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-500 text-sm">{invoice.createdOn}</td>
              <td className="p-4 text-gray-600 text-sm font-medium">{invoice.total}</td>
              <td className="p-4 text-gray-600 text-sm">{invoice.amountDue}</td>
              <td className="p-4 text-gray-500 text-sm">{invoice.dueDate}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  invoice.status === 'Paid' ? 'bg-green-50 text-green-500' : 
                  invoice.status === 'Overdue' ? 'bg-red-50 text-red-500' : 
                  invoice.status === 'Pending' ? 'bg-blue-50 text-blue-500' : 
                  'bg-yellow-50 text-yellow-500'
                }`}>
                  {invoice.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
