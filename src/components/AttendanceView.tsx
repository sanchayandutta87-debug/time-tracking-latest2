import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, ChevronRight, ArrowUpDown, MoreVertical, Home, Building2, Users, UserCheck, UserX, Clock, X, Filter, Download, Mail, Phone, Calendar as CalendarIcon, MapPin, Edit2, Trash2, FileText, CheckCircle2, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
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
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // 2. Fetch today's attendance
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', today);

      // 3. Fetch today's approved leaves
      const { data: todayLeaves } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('status', 'Approved')
        .lte('start_date', today)
        .gte('end_date', today);

      // 4. Fetch all attendance for the list
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (
            full_name,
            job_title,
            avatar_url,
            last_seen
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      // Calculate Stats
      const presentCount = todayAttendance?.length || 0;
      const lateCount = todayAttendance?.filter(a => a.is_late).length || 0;
      const leaveCount = todayLeaves?.length || 0;
      const absentCount = Math.max(0, (totalUsers || 0) - presentCount - leaveCount);

      setStats([
        { title: 'PRESENT', value: presentCount.toString(), icon: <CheckCircle2 size={20} />, color: 'emerald' },
        { title: 'ABSENT', value: absentCount.toString(), icon: <UserX size={20} />, color: 'red' },
        { title: 'LATE', value: lateCount.toString(), icon: <Clock size={20} />, color: 'amber' },
        { title: 'ON LEAVE', value: leaveCount.toString(), icon: <FileText size={20} />, color: 'purple' },
      ]);

      const formatted = (data || []).map(record => {
        const user = record.users as any;
        const now = new Date();
        const checkInTime = record.check_in ? new Date(record.check_in) : null;
        const checkOutTime = record.check_out ? new Date(record.check_out) : null;
        
        // AUTO-FINALIZATION LOGIC (Enhanced)
        const lastSeenTime = user?.last_seen ? new Date(user.last_seen) : null;
        const isOffline = lastSeenTime ? (now.getTime() - lastSeenTime.getTime()) > 300000 : true; // Offline if no activity for 5 mins
        
        let displayBreak = record.break_time || '00h 00m';
        let finalCheckOut = record.check_out;
        
        if (checkInTime && !record.check_out) {
          const hoursSinceIn = (now.getTime() - checkInTime.getTime()) / 3600000;
          
          if ((isOffline && hoursSinceIn > 2) || hoursSinceIn > 12) {
             const eightHoursLater = new Date(checkInTime.getTime() + 8 * 3600000);
             let autoOut = lastSeenTime || eightHoursLater;
             
             // Ensure autoOut isn't days later
             if (autoOut.getTime() - checkInTime.getTime() > 16 * 3600000) {
               autoOut = eightHoursLater;
             }
             
             finalCheckOut = autoOut.toISOString();
             displayBreak = '01h 00m';
          }
        } else if (checkInTime && checkOutTime && !record.break_time) {
           const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / 3600000;
           if (hoursWorked > 4) {
             displayBreak = '01h 00m';
           }
        }

        let totalWorkedStr = '00h 00m 00s';
        if (record.check_in && (finalCheckOut || record.check_out)) {
          const outTime = finalCheckOut ? new Date(finalCheckOut) : new Date(record.check_out);
          let diffMs = outTime.getTime() - new Date(record.check_in).getTime();
          
          // Safeguard: Cap duration to 24 hours for a single attendance record
          const maxMs = 24 * 3600000;
          if (diffMs > maxMs) diffMs = 8 * 3600000; // Fallback to standard 8h if data is corrupted
          
          let totalSeconds = Math.floor(Math.max(0, diffMs) / 1000);
          
          if (displayBreak === '01h 00m') {
            totalSeconds = Math.max(0, totalSeconds - 3600);
          }

          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          totalWorkedStr = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        }

        return {
          id: record.id,
          name: user?.full_name || 'Unknown',
          avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=random`,
          role: user?.job_title || 'Team Member',
          date: record.date,
          shiftStart: record.shift_start || '09:00 AM',
          actualStart: formatTime(record.check_in),
          actualEnd: formatTime(finalCheckOut || record.check_out),
          shiftEnd: record.shift_end || '06:00 PM',
          minHours: record.min_hours || '08h 00m',
          actualHours: totalWorkedStr,
          breakTime: displayBreak,
          status: record.is_late ? 'LATE' : (record.check_in ? 'PRESENT' : 'ABSENT')
        };
      });

      setAttendance(formatted);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);


  return (
    <div className="p-8 bg-gray-50 dark:bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">Attendance Report</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0A0A0B]/60 backdrop-blur-xl p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-5">
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
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-white/5 mb-8">
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
      <div className="bg-white dark:bg-[#0A0A0B]/80 backdrop-blur-xl rounded-[32px] border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
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
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {attendance.map((row) => (
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
