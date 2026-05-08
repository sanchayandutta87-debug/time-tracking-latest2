import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronRight, ArrowUpDown, FileText, Check, X, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import ApplyLeaveModal from './ApplyLeaveModal';

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  type: string;
  fromDate: string;
  toDate: string;
  duration: string;
  avatar: string;
  status: string;
  reason: string;
}

export default function LeaveView() {
  const { showToast } = useAppContext();
  const { currentUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Requested');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaves = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch leave_requests (filtered by user if employee)
      let query = supabase
        .from('leave_requests')
        .select('*, users(full_name, job_title, avatar_url)')
        .order('created_at', { ascending: false });
      
      if (currentUser?.role === 'employee') {
        query = query.eq('user_id', currentUser.id);
      }

      const { data: leavesData, error: leavesError } = await query;

      if (leavesError) throw leavesError;
      if (!leavesData) return;

      const formatted = leavesData.map(item => {
        const user = item.users;
        const fromDate = new Date(item.start_date);
        const toDate = new Date(item.end_date);
        
        const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Map database status 'pending' to UI status 'Requested'
        const displayStatus = item.status === 'pending' ? 'Requested' : 
                            (item.status.charAt(0).toUpperCase() + item.status.slice(1));

        return {
          id: item.id,
          name: user?.full_name || 'Unknown Employee',
          role: user?.job_title || 'Team Member',
          type: item.type,
          fromDate: fromDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          toDate: toDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          duration: diffDays === 1 ? '1 Day' : `${diffDays} Days`,
          avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=random`,
          status: displayStatus,
          reason: item.reason
        };
      });

      setLeaves(formatted);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Database status is lowercase 'approved', 'rejected'
      const dbStatus = status.toLowerCase() === 'requested' ? 'pending' : status.toLowerCase();

      // 1. Get the leave details first to know who to notify
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('user_id, type')
        .eq('id', id)
        .single();

      // 2. Update the status
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: dbStatus })
        .eq('id', id);

      if (error) throw error;

      // 3. Create a notification for the employee
      if (leaveData) {
        const title = status === 'Approved' ? 'Leave Request Approved! 🎉' : 'Leave Request Rejected';
        const message = status === 'Approved' 
          ? `Your request for ${leaveData.type} has been approved by Management.`
          : `Your request for ${leaveData.type} was not approved at this time.`;

        await supabase.from('notifications').insert({
          user_id: leaveData.user_id,
          title,
          message,
          type: status === 'Approved' ? 'success' : 'error'
        });
      }

      fetchLeaves();
    } catch (error: any) {
      console.error('Error updating leave status:', error);
      showToast('Error updating status: ' + error.message, 'error');
    }
  };

  const filteredLeaves = leaves.filter(l => 
    l.status === activeTab && 
    (l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Leave</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
        {['Requested', 'Approved', 'Rejected'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 pb-4 font-bold transition-all ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white dark:bg-black flex items-center gap-2 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-full text-sm bg-transparent dark:text-white dark:placeholder-slate-500" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2 transition-colors">
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Apply
          </button>
        </div>
      </div>

      {/* Premium Table Container */}
      <div className="bg-white dark:bg-black backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Syncing Data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-black">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Employee</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Leave Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Schedule</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Duration</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredLeaves.length > 0 ? filteredLeaves.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={row.avatar} 
                            alt={row.name} 
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 dark:ring-white/5 group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-black rounded-full shadow-sm"></div>
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-800 dark:text-white tracking-tight">{row.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{row.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-block whitespace-nowrap px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-500/20 shadow-sm">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{row.fromDate}</span>
                          <ChevronRight size={12} className="text-gray-300" />
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{row.toDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-black text-gray-800 dark:text-white">
                        <Clock size={14} className="text-gray-400" />
                        {row.duration}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 
                        row.status === 'Rejected' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 
                        'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {row.status === 'Requested' && (currentUser?.role?.toLowerCase() === 'administrator' || currentUser?.role?.toLowerCase() === 'management') && (
                          <div className="flex items-center gap-2 border-l border-gray-100 dark:border-white/5 pl-3">
                            <button 
                              onClick={() => handleUpdateStatus(row.id, 'Approved')}
                              className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(row.id, 'Rejected')}
                              className="px-4 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                          <CalendarIcon size={32} />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">No Records Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApplyLeaveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchLeaves}
      />
    </div>
  );
}
