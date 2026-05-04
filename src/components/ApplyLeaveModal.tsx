import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, FileText, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyLeaveModal({ isOpen, onClose, onSuccess }: ApplyLeaveModalProps) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    fromDate: '',
    toDate: '',
    reason: ''
  });

  useEffect(() => {
    const fetchTypes = async () => {
      const { data } = await supabase
        .from('leave_types')
        .select('*')
        .eq('status', 'Active');
      
      if (data && data.length > 0) {
        setLeaveTypes(data);
        setFormData(prev => ({ ...prev, type: data[0].name }));
      }
    };

    if (isOpen) {
      fetchTypes();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: currentUser.id,
          type: formData.type,
          start_date: formData.fromDate,
          end_date: formData.toDate,
          reason: formData.reason,
          status: 'pending'
        });

      if (error) throw error;
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error applying for leave:', error);
      alert('Error applying for leave: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-[#0A0A0B] rounded-[40px] shadow-2xl z-[101] overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            
            <div className="p-10 pb-6 flex justify-between items-center relative">
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Apply for Leave</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Submit your request for review</p>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 pt-4 space-y-8 relative">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Leave Type</label>
                <div className="relative group">
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white appearance-none"
                  >
                    {leaveTypes.length > 0 ? (
                      leaveTypes.map(type => (
                        <option key={type.id} value={type.name} className="dark:bg-slate-900">{type.name}</option>
                      ))
                    ) : (
                      <option disabled value="">No leave types available</option>
                    )}
                  </select>
                  <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">From Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      required
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">To Date</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      required
                      type="date"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Reason for Leave</label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <textarea
                    required
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Briefly describe why you need this leave..."
                    className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/50 transition-all dark:text-white resize-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black py-5 rounded-[24px] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={20} />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
