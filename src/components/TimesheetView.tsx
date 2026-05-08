import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

interface TimelineItem {
  start: string;
  end: string;
  type: 'active' | 'break' | 'meeting';
}

interface WeeklyData {
  [date: string]: {
    totalMinutes: number;
    checkIn: string | null;
    checkOut: string | null;
  };
}

interface TimesheetRecord {
  id: string;
  name: string;
  role: string;
  totalTime: string;
  avatar: string;
  isOnline: boolean;
  checkIn: string | null;
  checkOut: string | null;
  timeline: TimelineItem[];
  weeklyData?: WeeklyData;
}

const hours = ['06 AM', '08 AM', '10 AM', '12 PM', '02 PM', '04 PM', '06 PM', '08 PM', '10 PM', '12 AM', '02 AM', '04 AM'];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TimesheetView() {
  const { darkMode } = useAppContext();
  const [records, setRecords] = useState<TimesheetRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTimesheet = async () => {
    setIsLoading(true);
    try {
      const isWeekView = activeTab === 'Week';
      let query = supabase.from('users').select(`
        id,
        full_name,
        job_title,
        avatar_url,
        last_seen,
        attendance (
          id,
          check_in,
          check_out,
          date
        )
      `);

      if (isWeekView) {
        const curr = new Date(selectedDate);
        const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
        const last = first + 6;
        const firstDay = new Date(curr.setDate(first)).toISOString().split('T')[0];
        const lastDay = new Date(curr.setDate(last)).toISOString().split('T')[0];
        query = query.gte('attendance.date', firstDay).lte('attendance.date', lastDay);
      } else {
        query = query.eq('attendance.date', selectedDate);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted: TimesheetRecord[] = (data || []).map(user => {
        const attendances = user.attendance || [];
        const lastSeen = user.last_seen ? new Date(user.last_seen).getTime() : 0;
        const isOnline = (new Date().getTime() - lastSeen) < 120000;

        let totalMinutes = 0;
        const weeklyData: WeeklyData = {};

        attendances.forEach(att => {
          let mins = 0;
          if (att.check_in && att.check_out) {
            mins = Math.floor((new Date(att.check_out).getTime() - new Date(att.check_in).getTime()) / 60000);
          } else if (att.check_in && att.date === new Date().toISOString().split('T')[0]) {
            mins = Math.floor((new Date().getTime() - new Date(att.check_in).getTime()) / 60000);
          }
          totalMinutes += mins;
          weeklyData[att.date] = { totalMinutes: mins, checkIn: att.check_in, checkOut: att.check_out };
        });

        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        const totalWorkedStr = `${h}h ${m}m`;

        const todayAtt = attendances.find(a => a.date === selectedDate);

        return {
          id: user.id,
          name: user.full_name,
          role: user.job_title || 'Employee',
          totalTime: totalWorkedStr,
          avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`,
          isOnline,
          checkIn: todayAtt?.check_in || null,
          checkOut: todayAtt?.check_out || null,
          timeline: [],
          weeklyData
        };
      });

      setRecords(formatted);
    } catch (error) {
      console.error('Error fetching timesheet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheet();
    const subscription = supabase
      .channel('timesheet-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => fetchTimesheet())
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, [selectedDate, activeTab]);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const renderTimeline = (record: TimesheetRecord) => {
    const startOfDay = new Date();
    startOfDay.setHours(6, 0, 0, 0);
    const endOfDay = new Date(startOfDay.getTime() + 22 * 60 * 60 * 1000);
    const totalMs = endOfDay.getTime() - startOfDay.getTime();

    if (!record.checkIn) {
      return (
        <div className="h-10 bg-gray-100/50 dark:bg-black rounded-xl w-full flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest">No Activity</span>
        </div>
      );
    }

    const checkInTime = new Date(record.checkIn);
    const checkOutTime = record.checkOut ? new Date(record.checkOut) : new Date();

    const startOffset = Math.max(0, ((checkInTime.getTime() - startOfDay.getTime()) / totalMs) * 100);
    const width = Math.min(100 - startOffset, ((checkOutTime.getTime() - checkInTime.getTime()) / totalMs) * 100);

    return (
      <div className="h-10 bg-gray-100/30 dark:bg-black rounded-xl w-full flex items-center relative overflow-hidden group/timeline border border-gray-100/50 dark:border-gray-800">
        {/* Hour Grid Lines */}
        <div className="absolute inset-0 flex justify-between px-0.5 pointer-events-none opacity-20">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-gray-400 dark:bg-gray-800" />
          ))}
        </div>

        {/* Work Bar */}
        <div 
          className="h-7 bg-gradient-to-r from-emerald-500 to-teal-400 dark:from-emerald-600 dark:to-teal-500 rounded-lg shadow-lg shadow-emerald-500/20 relative group-hover/timeline:scale-[1.02] transition-all duration-500"
          style={{ 
            marginLeft: `${startOffset}%`, 
            width: `${Math.max(width, 2)}%`,
            minWidth: '12px'
          }}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20 rounded-lg" />
          
          {/* Pulsing indicator for active sessions */}
          {record.isOnline && !record.checkOut && (
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
              <div className="absolute inset-0.5 bg-white rounded-full shadow-sm" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Timesheet</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Workspace</span>
            <ChevronRight size={12} />
            <span className="text-gray-900 dark:text-gray-300">Live Tracker</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-black p-1.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
           <button 
            onClick={() => setActiveTab('Day')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all active:scale-95 ${activeTab === 'Day' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
           >
            Day
           </button>
           <button 
            onClick={() => setActiveTab('Week')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all active:scale-95 ${activeTab === 'Week' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
           >
            Week
           </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
        <div className="relative w-full lg:w-96 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div 
            onClick={triggerDatePicker}
            className="relative flex items-center gap-2 px-5 py-3.5 bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm cursor-pointer hover:border-gray-200 dark:hover:border-gray-700 transition-all overflow-hidden active:scale-95"
          >
             <Calendar className="text-blue-500 pointer-events-none" size={18} />
             <span className="text-sm font-bold text-gray-700 dark:text-slate-300 pointer-events-none select-none">
               {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
             </span>
             <input 
              ref={dateInputRef}
              type="date" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full pointer-events-none"
              value={selectedDate}
              onChange={handleDateChange}
             />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
                <th className="pl-8 pr-6 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Member Info</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] w-32 text-center">Total {activeTab === 'Week' ? 'Week' : 'Day'}</th>
                {activeTab === 'Day' ? (
                  hours.map((hour, i) => (
                    <th key={i} className="px-2 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 text-center uppercase tracking-tighter w-20">{hour}</th>
                  ))
                ) : (
                  weekDays.map((day, i) => (
                    <th key={i} className="px-2 py-6 text-[10px] font-black text-gray-400 dark:text-slate-500 text-center uppercase tracking-widest">{day}</th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 dark:divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={24} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                       <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                       <p className="text-sm font-bold text-gray-400 dark:text-slate-500 animate-pulse uppercase tracking-widest">Gathering Records...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? filteredRecords.map((row) => (
                <tr key={row.id} className="hover:bg-blue-600/5 transition-all group">
                  <td className="pl-8 pr-6 py-8">
                    <div className="flex items-center gap-5">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-500">
                          {row.avatar ? (
                            <img 
                              src={row.avatar} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`;
                              }}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-sm font-black text-gray-400 dark:text-slate-500">{row.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white dark:border-slate-800 shadow-sm transition-colors duration-500 ${row.isOnline ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' : 'bg-gray-400'}`} />
                      </div>
                      <div className="min-w-[140px]">
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{row.name}</p>
                        <span className="inline-block text-[9px] font-black px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-[0.1em]">{row.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex justify-center">
                      <span className="w-24 text-center text-xs font-black text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-black py-2 rounded-xl border border-gray-200/50 dark:border-gray-800 shadow-sm">
                        {row.totalTime}
                      </span>
                    </div>
                  </td>
                  {activeTab === 'Day' ? (
                    <td colSpan={hours.length} className="px-6 py-8">
                      {renderTimeline(row)}
                    </td>
                  ) : (
                    weekDays.map((_, i) => {
                      const curr = new Date(selectedDate);
                      const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);
                      const dayDate = new Date(curr.setDate(first + i)).toISOString().split('T')[0];
                      const dayData = row.weeklyData?.[dayDate];
                      
                      return (
                        <td key={i} className="px-2 py-8">
                          <div className="flex flex-col items-center gap-2">
                            {dayData ? (
                              <>
                                <div className="w-1.5 h-12 bg-gray-100 dark:bg-black rounded-full relative overflow-hidden">
                                  <div 
                                    className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    style={{ height: `${Math.min(100, (dayData.totalMinutes / 480) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-[9px] font-bold text-gray-500 dark:text-slate-400">
                                  {Math.floor(dayData.totalMinutes / 60)}h
                                </span>
                              </>
                            ) : (
                              <div className="w-1.5 h-12 bg-gray-100 dark:bg-black rounded-full opacity-20" />
                            )}
                          </div>
                        </td>
                      );
                    })
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={24} className="py-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <p className="text-lg font-bold text-gray-300 dark:text-slate-700 mb-2">No Records Found</p>
                      <p className="text-xs text-gray-400 dark:text-slate-600">Try adjusting your search or check back later today.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
