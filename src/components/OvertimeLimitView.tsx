import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  AlertTriangle, ShieldAlert, TrendingUp, BarChart3,
  Loader2, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const overtimeData: any[] = [];

export default function OvertimeLimitView() {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [overtime, setOvertime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalOvertime: '0h',
    highSeverity: 0,
    avgOvertime: '0h'
  });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const fetchOvertimeData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url,
            last_seen
          )
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      // Group by User and Date
      const userDateMap: any = {};
      (data || []).forEach(entry => {
        const userId = entry.user_id;
        const date = new Date(entry.start_time).toISOString().split('T')[0];
        const key = `${userId}_${date}`;

        if (!userDateMap[key]) {
          userDateMap[key] = {
            userId,
            userName: entry.users?.full_name || 'Unknown',
            avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
            lastSeen: entry.users?.last_seen,
            date,
            totalMinutes: 0,
            sessions: []
          };
        }

        const end = entry.end_time ? new Date(entry.end_time) : new Date();
        const duration = Math.floor((end.getTime() - new Date(entry.start_time).getTime()) / 60000);
        userDateMap[key].totalMinutes += duration;
        userDateMap[key].sessions.push({
          id: entry.id,
          startTime: new Date(entry.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          endTime: end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.floor(duration / 60)}h ${duration % 60}m`
        });
      });

      // Filter for Overtime (> 8 hours)
      const overtimeUsers: any = {};
      let totalOvertimeMin = 0;

      Object.values(userDateMap).forEach((day: any) => {
        if (day.totalMinutes > 480) { // > 8 hours
          const otMin = day.totalMinutes - 480;
          totalOvertimeMin += otMin;

          if (!overtimeUsers[day.userId]) {
            const lastSeenDate = day.lastSeen ? new Date(day.lastSeen) : null;
            const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

            overtimeUsers[day.userId] = {
              id: day.userId,
              name: day.userName,
              avatar: day.avatar,
              status: isOnline ? 'online' : 'offline',
              totalMinutes: 0,
              sessions: []
            };
          }

          overtimeUsers[day.userId].totalMinutes += otMin;
          overtimeUsers[day.userId].sessions.push({
            date: day.date,
            overtime: `${Math.floor(otMin / 60)}h ${otMin % 60}m`,
            details: day.sessions
          });
        }
      });

      const formatted = Object.values(overtimeUsers).map((user: any) => {
        const th = Math.floor(user.totalMinutes / 60);
        const tm = user.totalMinutes % 60;
        const severity = user.totalMinutes > 600 ? 'high' : user.totalMinutes > 300 ? 'medium' : 'low';

        return {
          ...user,
          totalOvertime: `${th}h ${tm}m`,
          severity
        };
      });

      setOvertime(formatted);
      setStats({
        totalOvertime: `${Math.floor(totalOvertimeMin / 60)}h`,
        highSeverity: formatted.filter(u => u.severity === 'high').length,
        avgOvertime: formatted.length > 0 ? `${Math.floor((totalOvertimeMin / formatted.length) / 60)}h` : '0h'
      });

    } catch (err) {
      console.error('Overtime error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOvertimeData();
  }, []);

  const filteredData = overtime.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high': return (darkMode ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100');
      case 'medium': return (darkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100');
      default: return (darkMode ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100');
    }
  };

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Overtime Limit</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Overtime Limit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Overtime</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalOvertime}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Limit Exceeded</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{overtime.length} Users</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Severity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.highSeverity}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg. Overtime</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgOvertime}</h3>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Scanning for overtime violations...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Overtime</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Severity</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <React.Fragment key={record.id}>
                  <tr 
                    onClick={() => toggleRow(record.id)}
                    className={`transition-colors cursor-pointer ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'} ${expandedRows.includes(record.id) ? (darkMode ? 'bg-blue-900/10' : 'bg-blue-50/30') : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</h4>
                          {expandedRows.includes(record.id) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-red-500" />
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.totalOvertime}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityStyles(record.severity)}`}>
                        {record.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'}`}>
                        <Info size={16} />
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows.includes(record.id) && (
                    <tr>
                      <td colSpan={4} className={`p-0 ${darkMode ? 'bg-gray-900/20' : 'bg-gray-50/30'}`}>
                        <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Overtime Sessions Breakdown</h5>
                          <div className="space-y-4">
                            {record.sessions.map((session: any, idx: number) => (
                              <div key={idx} className={`p-4 rounded-xl border ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} shadow-sm`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{session.date}</span>
                                  <span className="text-xs font-bold text-red-600">Overtime: {session.overtime}</span>
                                </div>
                                <div className="space-y-2">
                                  {session.details.map((detail: any, dIdx: number) => (
                                    <div key={dIdx} className="flex justify-between items-center text-[10px] text-gray-500 border-t pt-2 border-gray-50">
                                      <div className="flex items-center gap-2">
                                        <Clock size={12} />
                                        <span>{detail.startTime} - {detail.endTime}</span>
                                      </div>
                                      <span className="font-bold">{detail.duration}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500 font-bold">No overtime violations detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
