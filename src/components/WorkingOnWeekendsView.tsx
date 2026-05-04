import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  Clock, Download, Printer, ChevronDown, ChevronUp, Info,
  TrendingUp, BarChart3, Loader2, AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const weekendWorkData: any[] = [];

export default function WorkingOnWeekendsView() {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [weekendWork, setWeekendWork] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalWeekendHours: '0h',
    activeUsers: 0,
    mostActiveDay: 'Sunday'
  });

  const toggleRow = (id: string) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const fetchWeekendWorkData = async () => {
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
          ),
          projects (name)
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      const weekendUsers: any = {};
      let totalMin = 0;
      let satCount = 0;
      let sunCount = 0;

      (data || []).forEach(entry => {
        const start = new Date(entry.start_time);
        const day = start.getDay(); 

        if (day === 0 || day === 6) {
          const userId = entry.user_id;
          const end = entry.end_time ? new Date(entry.end_time) : new Date();
          const duration = Math.floor((end.getTime() - start.getTime()) / 60000);
          totalMin += duration;

          if (day === 0) sunCount++; else satCount++;

          if (!weekendUsers[userId]) {
            const lastSeenDate = entry.users?.last_seen ? new Date(entry.users.last_seen) : null;
            const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

            weekendUsers[userId] = {
              id: userId,
              name: entry.users?.full_name || 'Unknown',
              avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
              status: isOnline ? 'online' : 'offline',
              totalMinutes: 0,
              days: new Set(),
              sessions: []
            };
          }

          weekendUsers[userId].totalMinutes += duration;
          weekendUsers[userId].days.add(day === 0 ? 'Sunday' : 'Saturday');

          const h = Math.floor(duration / 60);
          const m = duration % 60;

          weekendUsers[userId].sessions.push({
            id: entry.id,
            date: start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            day: day === 0 ? 'Sunday' : 'Saturday',
            duration: `${h}h ${m}m`,
            project: entry.projects?.name || 'General Work',
            startTime: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            endTime: end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            status: 'approved'
          });
        }
      });

      const formatted = Object.values(weekendUsers).map((user: any) => {
        const th = Math.floor(user.totalMinutes / 60);
        const tm = user.totalMinutes % 60;
        const type = Array.from(user.days).join(' & ');

        return {
          ...user,
          totalWeekendHours: `${th}h ${tm}m`,
          weekendType: type
        };
      });

      setWeekendWork(formatted);
      setStats({
        totalWeekendHours: `${Math.floor(totalMin / 60)}h`,
        activeUsers: formatted.length,
        mostActiveDay: sunCount >= satCount ? 'Sunday' : 'Saturday'
      });

    } catch (err) {
      console.error('Weekend work error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekendWorkData();
  }, []);

  const filteredData = weekendWork.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Working on Weekends</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Working on Weekends</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Weekend Hours</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalWeekendHours}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Employees</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.activeUsers}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Most Active Day</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.mostActiveDay}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekend Activity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>High</h3>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Retrieving weekend logs...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Weekend Hours</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Weekend Type</th>
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
                        <Clock size={16} className="text-blue-500" />
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.totalWeekendHours}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                        {record.weekendType}
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
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Session Details</h5>
                          <div className="space-y-3">
                            {record.sessions.map((session: any) => (
                              <div key={session.id} className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <Clock size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-800">{session.date} ({session.day})</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{session.startTime} - {session.endTime}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-8">
                                  <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Project</p>
                                    <p className="text-xs font-bold text-gray-600">{session.project}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-blue-400 uppercase font-bold">Duration</p>
                                    <p className="text-xs font-bold text-blue-600">{session.duration}</p>
                                  </div>
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
                  <td colSpan={4} className="p-20 text-center text-gray-500 font-bold">No weekend work activity detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
