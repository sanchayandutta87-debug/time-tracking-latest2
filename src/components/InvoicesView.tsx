import React from 'react';
import { ChevronRight, Plus, LayoutGrid, FileText, FileUp, CalendarClock } from 'lucide-react';
import InvoiceStatCard from './InvoiceStatCard';
import InvoicesTable from './InvoicesTable';

const invoiceStats = [
  { title: 'Total Invoice', value: '$2,45,445', change: '31%', isPositive: true, icon: <LayoutGrid size={20} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { title: 'Unpaid Invoice', value: '$50,000', change: '15%', isPositive: false, icon: <FileText size={20} />, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  { title: 'Pending Invoice', value: '$45,000', change: '48%', isPositive: true, icon: <FileUp size={20} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { title: 'Overdue Invoice', value: '$2,50,550', change: '39%', isPositive: true, icon: <CalendarClock size={20} />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
];

export default function InvoicesView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Invoices</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Invoices</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {invoiceStats.map((stat, i) => (
          <InvoiceStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800">Invoices</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <InvoicesTable />
    </div>
  );
}
