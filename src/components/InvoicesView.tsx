import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, LayoutGrid, FileText, FileUp, CalendarClock, Loader2 } from 'lucide-react';
import InvoiceStatCard from './InvoiceStatCard';
import InvoicesTable from './InvoicesTable';
import CreateInvoiceModal from './CreateInvoiceModal';
import InvoiceBillView from './InvoiceBillView';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

export default function InvoicesView() {
  const { currentUser } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    
    fetchInvoices();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('invoices-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${currentUser.id}` },
        () => fetchInvoices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  if (selectedInvoice) {
    return (
      <InvoiceBillView 
        invoice={selectedInvoice} 
        onBack={() => setSelectedInvoice(null)} 
      />
    );
  }

  const stats = [
    { title: 'Total Invoice', value: `$${invoices.reduce((acc, inv) => acc + inv.total_amount, 0).toLocaleString()}`, change: '31%', isPositive: true, icon: <LayoutGrid size={20} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { title: 'Unpaid Invoice', value: `$${invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + inv.amount_due, 0).toLocaleString()}`, change: '15%', isPositive: false, icon: <FileText size={20} />, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
    { title: 'Pending Invoice', value: `$${invoices.filter(i => i.status === 'Pending').reduce((acc, inv) => acc + inv.total_amount, 0).toLocaleString()}`, change: '48%', isPositive: true, icon: <FileUp size={20} />, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
    { title: 'Overdue Invoice', value: `$${invoices.filter(i => i.status === 'Overdue').reduce((acc, inv) => acc + inv.total_amount, 0).toLocaleString()}`, change: '39%', isPositive: true, icon: <CalendarClock size={20} />, iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50/30 dark:bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Invoices</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">Invoices</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <InvoiceStatCard key={i} {...stat} />
        ))}
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Invoices</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Loading invoices...</p>
          </div>
        ) : (
          <InvoicesTable invoices={invoices} onRowClick={setSelectedInvoice} />
        )}
      </div>

      <CreateInvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchInvoices()} 
      />
    </div>
  );
}
