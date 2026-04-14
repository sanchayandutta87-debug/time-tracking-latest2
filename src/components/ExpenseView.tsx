import React from 'react';
import { Search, Plus, ChevronRight, ArrowUpDown, MoreVertical } from 'lucide-react';

const expenseData = [
  {
    id: '#EP4521',
    name: 'Flight Travel',
    category: 'Travel',
    date: '15 May 2025',
    currency: 'USD',
    amount: '5000',
    project: 'Doccure',
    billable: true,
    reimburse: false
  },
  {
    id: '#EP4533',
    name: 'Auto Rental',
    category: 'Travel',
    date: '13 May 2025',
    currency: 'Euro',
    amount: '1459',
    project: 'Tour & Travel',
    billable: true,
    reimburse: false
  },
  {
    id: '#EP4542',
    name: 'Entertainment',
    category: 'Advertising',
    date: '11 May 2025',
    currency: 'Dhirams',
    amount: '6589',
    project: 'CSPSC',
    billable: true,
    reimburse: false
  },
  {
    id: '#EP4567',
    name: 'Food',
    category: 'Travel',
    date: '26 Apr 2025',
    currency: 'Euro',
    amount: '4754',
    project: 'Law Maker',
    billable: true,
    reimburse: false
  },
  {
    id: '#EP4531',
    name: 'Car Booking',
    category: 'Advertising',
    date: '24 Apr 2025',
    currency: 'Dhirams',
    amount: '2145',
    project: 'Service Marketplace',
    billable: true,
    reimburse: false
  },
  {
    id: '#EP4524',
    name: 'Entertainment',
    category: 'Advertising',
    date: '20 Apr 2025',
    currency: 'Euro',
    amount: '6589',
    project: 'Chat App',
    billable: true,
    reimburse: false
  }
];

export default function ExpenseView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Expense</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Expense</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          Requested
        </button>
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          Expense
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          Approved
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          Rejected
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="bg-white border border-gray-100 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">ID</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Entry Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Currency</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Amount</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Project</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Billable</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Reimburse</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenseData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600">{row.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-400">Category : {row.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.currency}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">{row.project}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.billable ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${row.billable ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.reimburse ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${row.reimburse ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
