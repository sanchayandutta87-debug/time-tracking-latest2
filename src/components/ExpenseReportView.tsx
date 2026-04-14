import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  ChevronDown, Download, Printer, Info, 
  BarChart3, DollarSign, Receipt, 
  CheckCircle2, Clock, AlertCircle, 
  Filter, MoreVertical, FileText, 
  TrendingUp, Wallet, ArrowUpRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

interface ExpenseRecord {
  id: number;
  name: string;
  entryDate: string;
  submissionDate: string;
  amount: number;
  project: string;
  status: 'approved' | 'pending' | 'rejected';
  category: string;
  employee: string;
  hasReceipt: boolean;
}

const initialData: ExpenseRecord[] = [
  { id: 1, name: 'Flight Travel', entryDate: '15 May 2025', submissionDate: '15 May 2025', amount: 5000, project: 'Doccure', status: 'approved', category: 'Travel', employee: 'Shaun Farley', hasReceipt: true },
  { id: 2, name: 'Auto Rental', entryDate: '13 May 2025', submissionDate: '13 May 2025', amount: 1459, project: 'Tour & Travel', status: 'pending', category: 'Transport', employee: 'Jenny Ellis', hasReceipt: true },
  { id: 3, name: 'Entertainment', entryDate: '11 May 2025', submissionDate: '11 May 2025', amount: 6589, project: 'CSPSC', status: 'approved', category: 'Entertainment', employee: 'Leon Baxter', hasReceipt: false },
  { id: 4, name: 'Food', entryDate: '26 Apr 2025', submissionDate: '26 Apr 2025', amount: 4754, project: 'Law Maker', status: 'rejected', category: 'Meals', employee: 'Karen Flores', hasReceipt: true },
  { id: 5, name: 'Car Booking', entryDate: '24 Apr 2025', submissionDate: '24 Apr 2025', amount: 2145, project: 'Service Marketplace', status: 'approved', category: 'Transport', employee: 'Charles Cline', hasReceipt: true },
  { id: 6, name: 'Entertainment', entryDate: '20 Apr 2025', submissionDate: '20 Apr 2025', amount: 6589, project: 'Chat App', status: 'pending', category: 'Entertainment', employee: 'Aliza Duncan', hasReceipt: true },
  { id: 7, name: 'Car Booking', entryDate: '23 Mar 2025', submissionDate: '23 Mar 2025', amount: 1458, project: 'Booking Management', status: 'approved', category: 'Transport', employee: 'Leslie Hensley', hasReceipt: false },
  { id: 8, name: 'Auto Rental', entryDate: '15 Mar 2025', submissionDate: '15 Mar 2025', amount: 3658, project: 'Pilot Rider', status: 'approved', category: 'Transport', employee: 'Shaun Farley', hasReceipt: true },
  { id: 9, name: 'Others', entryDate: '21 Feb 2025', submissionDate: '21 Feb 2025', amount: 4785, project: 'Entry Management', status: 'approved', category: 'Miscellaneous', employee: 'Jenny Ellis', hasReceipt: true },
  { id: 10, name: 'Food', entryDate: '16 Feb 2025', submissionDate: '16 Feb 2025', amount: 3659, project: 'Booking App Mobile', status: 'pending', category: 'Meals', employee: 'Leon Baxter', hasReceipt: true },
];

const categoryData = [
  { name: 'Travel', value: 5000, color: '#3b82f6' },
  { name: 'Transport', value: 8720, color: '#10b981' },
  { name: 'Meals', value: 8413, color: '#f59e0b' },
  { name: 'Entertainment', value: 13178, color: '#8b5cf6' },
  { name: 'Misc', value: 4785, color: '#94a3b8' },
];

export default function ExpenseReportView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredData = initialData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.project.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployee = selectedEmployee === 'All Employees' || record.employee === selectedEmployee;
    const matchesTab = activeTab === 'all' || record.status === activeTab;
    return matchesSearch && matchesEmployee && matchesTab;
  });

  const getStatusBadge = (status: ExpenseRecord['status']) => {
    switch (status) {
      case 'approved': return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><CheckCircle2 size={10} /> APPROVED</span>;
      case 'pending': return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><Clock size={10} /> PENDING</span>;
      case 'rejected': return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100"><AlertCircle size={10} /> REJECTED</span>;
    }
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Expense Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Expense Report</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <DollarSign size={20} />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <ArrowUpRight size={10} /> 12%
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-xl font-bold text-gray-800 mt-1">${totalAmount.toLocaleString()}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Clock size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
              8 Pending
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Approvals</p>
          <h3 className="text-xl font-bold text-gray-800 mt-1">$11,707</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Category</p>
          <h3 className="text-xl font-bold text-gray-800 mt-1">Entertainment</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <Receipt size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receipt Compliance</p>
          <h3 className="text-xl font-bold text-gray-800 mt-1">92%</h3>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              Expense Trends
            </h3>
            <select className="text-xs font-bold text-gray-400 bg-transparent outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-6">Category Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-medium text-gray-500">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-700">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 border-b lg:border-none w-full lg:w-auto overflow-x-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-4 lg:pb-0 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'all' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              All Expenses
              {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full lg:hidden" />}
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-4 lg:pb-0 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'pending' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Pending
              {activeTab === 'pending' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full lg:hidden" />}
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`pb-4 lg:pb-0 text-xs font-bold transition-all relative whitespace-nowrap ${activeTab === 'approved' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Approved
              {activeTab === 'approved' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full lg:hidden" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search expense, project..." 
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs font-medium focus:outline-none pr-8 min-w-[140px]"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option>All Employees</option>
                <option>Shaun Farley</option>
                <option>Jenny Ellis</option>
                <option>Leon Baxter</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                <Printer size={16} />
              </button>
              <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                <Download size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Entry Date</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Submission Date</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{record.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{record.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-medium text-gray-600">{record.employee}</p>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{record.entryDate}</td>
                  <td className="p-4 text-xs text-gray-500">{record.submissionDate}</td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-gray-900">${record.amount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {record.project}
                    </span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {record.hasReceipt && (
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Receipt">
                          <Receipt size={14} />
                        </button>
                      )}
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Search size={32} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">No expenses found</h4>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Expenses must be submitted within 30 days of the transaction date. Receipts are mandatory for all travel and entertainment expenses.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold text-blue-600 hover:underline">Expense Policy</button>
          <button className="text-xs font-bold text-blue-600 hover:underline">Approval Workflow</button>
        </div>
      </div>
    </div>
  );
}
