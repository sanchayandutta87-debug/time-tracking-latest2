import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, ChevronRight, ArrowUpDown, MoreVertical, Home, Building2, Users, UserCheck, UserX, Clock, X, Filter, Download, Mail, Phone, Calendar as CalendarIcon, MapPin, Edit2, Trash2, FileText, CheckCircle2, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabase';

interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  date: string;
  shiftStart: string;
  actualStart: string;
  shiftEnd: string;
  actualEnd: string;
  minHours: string;
  actualHours: string;
  breakTime: string;
  status: string;
  avatar: string;
}

export default function AttendanceView() {
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('By Day');
  
  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '--:--';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
      return '--:--';
    }
  };

  const [stats, setStats] = useState([
    { title: 'PRESENT', value: '0', icon: <CheckCircle2 size={20} />, color: 'emerald' },
    { title: 'ABSENT', value: '0', icon: <UserX size={20} />, color: 'red' },
    { title: 'LATE', value: '0', icon: <Clock size={20} />, color: 'amber' },
    { title: 'ON LEAVE', value: '0', icon: <FileText size={20} />, color: 'purple' },
  ]);

  const fetchAttendance = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch ALL users
      const { data: allUsers, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) throw usersError;

      // 2. Fetch today's attendance
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today);

      // 3. Fetch today's approved leaves
      const { data: todayLeaves } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('status', 'approved')
        .lte('start_date', today)
        .gte('end_date', today);

      // 4. Fetch historical attendance
      let query = supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (*)
        `);
      
      // If employee, only fetch their own historical records
      if (currentUser.role === 'Employee') {
        query = query.eq('user_id', currentUser.id);
      }

      const { data: historicalData, error: historicalError } = await query.order('date', { ascending: false });
      if (historicalError) throw historicalError;

      // Calculate Stats (Global for Admin, Personal for Employee)
      const presentCount = todayAttendance?.length || 0;
      const lateCount = todayAttendance?.filter(a => a.is_late).length || 0;
      const leaveCount = todayLeaves?.length || 0;
      const totalUserCount = allUsers?.length || 0;
      const absentCount = Math.max(0, totalUserCount - presentCount - leaveCount);

      setStats([
        { title: 'PRESENT', value: presentCount.toString(), icon: <CheckCircle2 size={20} />, color: 'emerald' },
        { title: 'ABSENT', value: absentCount.toString(), icon: <UserX size={20} />, color: 'red' },
        { title: 'LATE', value: lateCount.toString(), icon: <Clock size={20} />, color: 'amber' },
        { title: 'ON LEAVE', value: leaveCount.toString(), icon: <FileText size={20} />, color: 'purple' },
      ]);

      // Map existing records
      const formattedHistorical = (historicalData || []).map(record => {
        const user = record.users as any;
        return {
          id: record.id,
          name: user?.full_name || 'Unknown',
          avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=random`,
          role: user?.job_title || 'Team Member',
          date: record.date,
          shiftStart: record.shift_start || '09:00 AM',
          actualStart: formatTime(record.check_in),
          actualEnd: formatTime(record.check_out),
          shiftEnd: record.shift_end || '06:00 PM',
          minHours: record.min_hours || '08h 00m',
          actualHours: record.actual_hours || '00h 00m',
          breakTime: record.break_time || '00h 00m',
          status: record.is_late ? 'LATE' : 'PRESENT'
        };
      });

      // For "By Day" view, if Admin, add "Absent" and "On Leave" users
      let finalData = formattedHistorical;
      const isAdmin = currentUser.role === 'Administrator';
      
      if (isAdmin) {
        const todayRecords = allUsers.map(user => {
          const att = todayAttendance?.find(a => a.user_id === user.id);
          const leave = todayLeaves?.find(l => l.user_id === user.id);
          
          if (att) return null; // Already in historical list
          
          return {
            id: `absent-${user.id}`,
            name: user.full_name,
            avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`,
            role: user.job_title || 'Employee',
            date: today,
            shiftStart: '09:00 AM',
            actualStart: '--:--',
            actualEnd: '--:--',
            shiftEnd: '06:00 PM',
            minHours: '08h 00m',
            actualHours: '00h 00m',
            breakTime: '00h 00m',
            status: leave ? 'ON LEAVE' : 'ABSENT'
          };
        }).filter(Boolean) as any[];

        finalData = [...formattedHistorical, ...todayRecords];
      }

      // Sort finalData: Date (desc) then Status (Present -> Late -> On Leave -> Absent)
      const statusPriority: any = { 'PRESENT': 0, 'LATE': 1, 'ON LEAVE': 2, 'ABSENT': 3 };
      finalData.sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
      });

      setAttendance(finalData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    const channel = supabase.channel('attendance-view-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
        fetchAttendance();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  const filteredAttendance = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    
    // Start of month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return attendance.filter(record => {
      const recordDate = new Date(record.date);
      
      if (activeTab === 'By Day') {
        return record.date === today;
      } else if (activeTab === 'By Week') {
        return recordDate >= startOfWeek;
      } else if (activeTab === 'By Month') {
        return recordDate >= startOfMonth;
      }
      return true;
    });
  }, [attendance, activeTab]);

  return (
    <div className="p-8 bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Report</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-black backdrop-blur-xl p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              stat.color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
              stat.color === 'red' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' :
              stat.color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
              'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400'
            }`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
        {['By Day', 'By Week', 'By Month'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 pb-4 font-bold transition-all text-sm ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            <CalendarIcon size={16} />
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-black backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-black">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shift Start</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actual Start</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Shift End</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actual End</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Min Hours</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actual Hours</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Break Time</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filteredAttendance.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={row.avatar} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-black text-gray-800 dark:text-white tracking-tight">{row.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{row.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-600 dark:text-gray-400">{row.shiftStart}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-800 dark:text-white">{row.actualStart}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-600 dark:text-gray-400">{row.shiftEnd}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-800 dark:text-white">{row.actualEnd}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-600 dark:text-gray-400">{row.minHours}</td>
                  <td className="px-8 py-6 text-xs font-black text-gray-800 dark:text-white tracking-tight">{row.actualHours}</td>
                  <td className="px-8 py-6 text-xs font-bold text-gray-600 dark:text-gray-400">{row.breakTime}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                      row.status === 'PRESENT' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' :
                      row.status === 'LATE' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' :
                      row.status === 'ABSENT' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20' :
                      'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20'
                    }`}>
                      {row.status}
                    </span>
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
