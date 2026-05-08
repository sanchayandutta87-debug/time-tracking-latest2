import React from 'react';
import { Search, Plus, ChevronRight, ArrowUpDown, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
  const { darkMode } = useAppContext();

  return (
    <div className={`p-8 min-h-full ${darkMode ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Expense</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Expense</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-8 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'} mb-8 whitespace-nowrap overflow-x-auto`}>
        <button className={`flex items-center gap-2 pb-4 font-bold transition-all ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
          Requested
        </button>
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          Expense
        </button>
        <button className={`flex items-center gap-2 pb-4 font-bold transition-all ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
          Approved
        </button>
        <button className={`flex items-center gap-2 pb-4 font-bold transition-all ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
          Rejected
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} flex items-center gap-2 border rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50`}>
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm bg-transparent" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className={`${darkMode ? 'bg-black border-gray-800 text-gray-300 hover:bg-gray-900' : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'} border px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all`}>
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-50 bg-gray-50/50'}`}>
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${darkMode ? 'bg-transparent border-gray-700' : ''}`} />
                </th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>ID</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Name</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Entry Date</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Currency</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Amount</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Project</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Billable</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Reimburse</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {expenseData.map((row, i) => (
                <tr key={i} className={`transition-colors group ${darkMode ? 'hover:bg-blue-500/[0.02]' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" className={`w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${darkMode ? 'bg-transparent border-gray-700' : ''}`} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600">{row.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{row.name}</p>
                      <p className="text-xs text-gray-400">Category : {row.category}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.currency}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>{row.project}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.billable ? 'bg-blue-600' : (darkMode ? 'bg-gray-800' : 'bg-gray-200')}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${row.billable ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.reimburse ? 'bg-blue-600' : (darkMode ? 'bg-gray-800' : 'bg-gray-200')}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${row.reimburse ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`p-2 transition-colors ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
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
