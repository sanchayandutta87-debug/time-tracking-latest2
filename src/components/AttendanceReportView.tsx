import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Download, 
  Clock, Filter, ChevronDown, CheckCircle2, XCircle, 
  AlertCircle, Coffee, FileText, Printer, Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

interface AttendanceRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  shiftStart: string;
  actualStart: string;
  shiftEnd: string;
  minHours: string;
  actualWorked: string;
  breakTime: string;
  attendanceStatus: 'Present' | 'Absent' | 'Late' | 'Holiday' | 'Half Day';
}

export const attendanceData: AttendanceRecord[] = [];

export default function AttendanceReportView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });

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
        .from('leaves')
        .select('*')
        .eq('status', 'Approved')
        .lte('from_date', today)
        .gte('to_date', today);

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

      console.log('Raw Attendance Data:', data);
      if (error) {
        console.error('Attendance fetch error:', error);
        throw error;
      }

      // Calculate Stats
      const presentCount = todayAttendance?.length || 0;
      const lateCount = todayAttendance?.filter(a => a.is_late).length || 0;
      const leaveCount = todayLeaves?.length || 0;
      const absentCount = Math.max(0, (totalUsers || 0) - presentCount - leaveCount);

      setStats({
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        onLeave: leaveCount
      });

      const formatted = (data || []).map(record => {
        const user = record.users as any;
        const now = new Date();
        const checkInTime = record.check_in ? new Date(record.check_in) : null;
        const lastSeenTime = user?.last_seen ? new Date(user.last_seen) : null;
        const isOffline = lastSeenTime ? (now.getTime() - lastSeenTime.getTime()) > 300000 : true;
        
        let displayBreak = record.break_time || '00h 00m';
        let finalCheckOut = record.check_out;
        
        if (checkInTime && !record.check_out) {
          const hoursSinceIn = (now.getTime() - checkInTime.getTime()) / 3600000;
          if ((isOffline && hoursSinceIn > 2) || hoursSinceIn > 12) {
             // Cap auto-out to either last seen (if same day) or 8 hours after check-in
             const eightHoursLater = new Date(checkInTime.getTime() + 8 * 3600000);
             let autoOut = lastSeenTime || eightHoursLater;
             
             // Ensure autoOut isn't days later
             if (autoOut.getTime() - checkInTime.getTime() > 16 * 3600000) {
               autoOut = eightHoursLater;
             }
             
             finalCheckOut = autoOut.toISOString();
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
          if (displayBreak === '01h 00m') totalSeconds = Math.max(0, totalSeconds - 3600);

          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          totalWorkedStr = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        }

        return {
          id: record.id,
          name: user?.full_name || 'Unknown',
          avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'U')}&background=random`,
          status: isOffline ? 'offline' : 'online',
          shiftStart: record.shift_start || '09:00 AM',
          actualStart: formatTime(record.check_in),
          shiftEnd: record.shift_end || '06:00 PM',
          minHours: record.min_hours || '08h 00m',
          actualWorked: totalWorkedStr,
          breakTime: displayBreak,
          attendanceStatus: record.is_late ? 'Late' : (record.check_in ? 'Present' : 'Absent')
        } as AttendanceRecord;
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

  const filteredData = attendance.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: AttendanceRecord['attendanceStatus']) => {
    switch (status) {
      case 'Present': return 'bg-emerald-500 text-white';
      case 'Absent': return 'bg-red-500 text-white';
      case 'Late': return 'bg-orange-500 text-white';
      case 'Holiday': return 'bg-purple-500 text-white';
      case 'Half Day': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Attendance Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Attendance Report</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Present</p>
            <h3 className="text-xl font-bold text-gray-800">{stats.present}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Absent</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.absent}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Late</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.late}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <Coffee size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">On Leave</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.onLeave}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'day' ? 'text-blue-600' : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar size={16} />
          By Day
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'week' ? 'text-blue-600' : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar size={16} />
          By Week
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('month')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'month' ? 'text-blue-600' : darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar size={16} />
          By Month
          {activeTab === 'month' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              darkMode ? 'bg-black border-gray-800 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900'
            }`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select className={`w-full lg:w-48 appearance-none border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 ${
              darkMode ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}>
              <option>All Employees</option>
              <option>Shaun Farley</option>
              <option>Jenny Ellis</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="date" 
              className={`w-full lg:w-48 border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                darkMode ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className={`p-2.5 border rounded-lg transition-colors ${darkMode ? 'bg-black border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`} title="Print">
              <Printer size={18} />
            </button>
            <button className={`p-2.5 border rounded-lg transition-colors ${darkMode ? 'bg-black border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`} title="Export PDF">
              <FileText size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Fetching live attendance records...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shift Start Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actual Start Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shift End Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Min Hours</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Actual Hours Worked</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Break Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={record.avatar} 
                          alt={record.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</h4>
                    </div>
                  </td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.shiftStart}</td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.actualStart}</td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.shiftEnd}</td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.minHours}</td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.actualWorked}</td>
                  <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.breakTime}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusColor(record.attendanceStatus)}`}>
                      {record.attendanceStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-20 text-center text-gray-500 font-bold">No attendance records found for the selected criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xs text-gray-400 font-medium">Showing 1 to 6 of 124 entries</p>
        <div className="flex items-center gap-2">
          <button className={`px-3 py-1.5 border rounded text-xs font-bold transition-all ${
            darkMode ? 'bg-black border-gray-800 text-gray-500 hover:text-white' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
          }`}>Previous</button>
          <button className={`px-3 py-1.5 rounded text-xs font-bold shadow-lg ${
            darkMode ? 'bg-blue-600 text-white shadow-blue-900/20' : 'bg-blue-600 text-white shadow-blue-100'
          }`}>1</button>
          <button className={`px-3 py-1.5 border rounded text-xs font-bold transition-all ${
            darkMode ? 'bg-black border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>2</button>
          <button className={`px-3 py-1.5 border rounded text-xs font-bold transition-all ${
            darkMode ? 'bg-black border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>3</button>
          <button className={`px-3 py-1.5 border rounded text-xs font-bold transition-all ${
            darkMode ? 'bg-black border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}>Next</button>
        </div>
      </div>
    </div>
  );
}
