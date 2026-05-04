import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Download, 
  Clock, Info, Filter, FileText, ChevronDown, Activity,
  Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

interface TimeLog {
  start: string; // e.g., "06:00"
  end: string;   // e.g., "08:00"
  type: 'active' | 'break' | 'overtime';
}

interface EmployeeTime {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
  totalTime: string;
  totalSeconds: number;
  logs: TimeLog[];
}

const hours = [
  '06 AM', '08 AM', '10 AM', '12 PM', '02 PM', '04 PM', 
  '06 PM', '08 PM', '10 PM', '12 AM', '02 AM', '04 AM'
];

export default function TimeSheetReportView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [employees, setEmployees] = useState<EmployeeTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: '0h 0m',
    activeCount: 0,
    totalCount: 0,
    avgProductivity: '0%'
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [selectedDate, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');
      
      if (usersError) throw usersError;

      // Calculate date range
      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(selectedDate);
      if (activeTab === 'day') {
        endDate.setHours(23, 59, 59, 999);
      } else {
        endDate.setDate(endDate.getDate() + 7);
        endDate.setHours(23, 59, 59, 999);
      }

      const { data: timeEntries, error: timeError } = await supabase
        .from('time_entries')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      if (timeError) throw timeError;

      const now = new Date();
      const formattedEmployees: EmployeeTime[] = usersData.map(user => {
        const userEntries = (timeEntries || []).filter(e => e.user_id === user.id);
        const totalSeconds = userEntries.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        
        const logs: TimeLog[] = userEntries.map(entry => {
          const start = new Date(entry.start_time);
          const end = new Date(start.getTime() + (entry.duration_seconds || 0) * 1000);
          
          const formatTime = (date: Date) => {
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
          };

          return {
            start: formatTime(start),
            end: formatTime(end),
            type: entry.description?.toLowerCase().includes('break') ? 'break' : 
                  entry.description?.toLowerCase().includes('overtime') ? 'overtime' : 'active'
          };
        });

        const lastSeen = user.last_seen ? new Date(user.last_seen) : null;
        const isOnline = lastSeen && (now.getTime() - lastSeen.getTime()) < 15 * 60 * 1000;

        return {
          id: user.id,
          name: user.full_name || 'Unknown',
          role: user.job_title || 'Employee',
          avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=random`,
          status: isOnline ? 'online' : 'offline',
          totalTime: `${Math.floor(totalSeconds / 3600)}h ${Math.floor((totalSeconds % 3600) / 60)}m`,
          totalSeconds,
          logs
        };
      });

      setEmployees(formattedEmployees);

      // Update Header Stats
      const totalSecs = formattedEmployees.reduce((acc, curr) => acc + curr.totalSeconds, 0);
      const activeEmployees = formattedEmployees.filter(emp => emp.status === 'online').length;
      
      setStats({
        totalHours: `${Math.floor(totalSecs / 3600)}h ${Math.floor((totalSecs % 3600) / 60)}m`,
        activeCount: activeEmployees,
        totalCount: formattedEmployees.length,
        avgProductivity: formattedEmployees.length > 0 ? `${Math.round((activeEmployees / formattedEmployees.length) * 100)}%` : '0%'
      });

    } catch (error) {
      console.error('Error fetching timesheet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedEmployee === 'All Employees' || emp.name === selectedEmployee)
  );

  // Helper to calculate position and width based on time
  // Timeline starts at 06:00 and ends at 06:00 next day (24 hours)
  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    let totalMinutes = h * 60 + m;
    // Adjust for 06:00 start
    totalMinutes -= 6 * 60;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getWidth = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    
    const diff = endMinutes - startMinutes;
    // Cap width to not overflow 24h
    const cappedDiff = Math.min(diff, 24 * 60);
    
    return (cappedDiff / (24 * 60)) * 100;
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-lg font-bold animate-pulse">Syncing Timesheets...</p>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Time Sheet Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Time Sheet Report</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm transition-all hover:scale-[1.02]`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Hours</p>
              <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalHours}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm transition-all hover:scale-[1.02]`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Employees</p>
              <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.activeCount} / {stats.totalCount}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm transition-all hover:scale-[1.02]`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Productivity</p>
              <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgProductivity}</h3>
            </div>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm transition-all hover:scale-[1.02]`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Export Report</p>
              <button className="text-xs font-black text-blue-500 hover:underline tracking-tight">DOWNLOAD PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
            activeTab === 'day' ? 'text-blue-500' : darkMode ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock size={14} />
            Time Sheet Report Day
          </div>
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
            activeTab === 'week' ? 'text-blue-500' : darkMode ? 'text-gray-600 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            Time Sheet Report Week
          </div>
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full" />}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-black border-gray-800 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select 
              className={`w-full lg:w-48 appearance-none border rounded-lg px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 ${
                darkMode ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option>All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full lg:w-48 border rounded-lg px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                darkMode ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] w-64 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Name</th>
                <th className={`p-4 text-[10px] font-black uppercase tracking-[0.2em] w-32 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Time (H)</th>
                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  <div className="flex justify-between">
                    {hours.map((hour, i) => (
                      <span key={i} className="text-[9px] font-bold">{hour}</span>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/30' : 'hover:bg-gray-50/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 transition-all"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${darkMode ? 'border-gray-900' : 'border-white'} ${emp.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{emp.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-black px-2.5 py-1.5 rounded-lg ${darkMode ? 'bg-gray-900 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      {emp.totalTime}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`relative h-10 rounded-xl overflow-hidden group/timeline ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'} border ${darkMode ? 'border-gray-800' : 'border-gray-200/50'}`}>
                      {/* Timeline Grid Lines */}
                      <div className="absolute inset-0 flex justify-between px-[2%]">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className={`h-full w-[1px] ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                        ))}
                      </div>

                      {/* Time Bars */}
                      {emp.logs.map((log, i) => (
                        <div 
                          key={i}
                          className={`absolute top-1.5 bottom-1.5 rounded-md transition-all hover:scale-y-110 cursor-help group/bar shadow-sm ${
                            log.type === 'active' ? 'bg-emerald-500' : 
                            log.type === 'break' ? 'bg-orange-400' : 'bg-blue-500'
                          }`}
                          style={{
                            left: `${getPosition(log.start)}%`,
                            width: `${getWidth(log.start, log.end)}%`
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-30 shadow-xl border border-gray-800 transition-all scale-90 group-hover/bar:scale-100">
                            <div className="flex flex-col gap-1">
                              <span className="text-blue-400 uppercase tracking-widest text-[8px]">{log.type}</span>
                              <span>{log.start} - {log.end}</span>
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900/95" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center gap-8 p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Active Time</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_8px_rgba(251,146,60,0.4)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Break</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Overtime / Special</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Info size={14} className="text-gray-400" />
          <span className={`text-[10px] font-bold italic tracking-tight ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Timeline shows 24-hour activity starting from 06:00 AM</span>
        </div>
      </div>
    </div>
  );
}
