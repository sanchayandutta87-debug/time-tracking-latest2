import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  Download, Printer, Filter, ChevronDown, Info,
  TrendingDown, BarChart3, Loader2, MousePointer2, AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const idleTimeData: any[] = [];

export default function IdleTimeReportView() {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [idleTime, setIdleTime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIdleTime: '0h',
    avgIdlePerUser: '0m',
    idleAlerts: 0
  });

  const fetchIdleTimeData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // We calculate "Idle" as gaps between time_entries for a user in the same day
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
        .gte('start_time', `${today}T00:00:00Z`)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const userGaps: any[] = [];
      const userEntries: Record<string, any[]> = {};

      (data || []).forEach(entry => {
        if (!userEntries[entry.user_id]) userEntries[entry.user_id] = [];
        userEntries[entry.user_id].push(entry);
      });

      let totalIdleMin = 0;

      Object.entries(userEntries).forEach(([userId, entries]) => {
        for (let i = 0; i < entries.length - 1; i++) {
          const currentEnd = new Date(entries[i].end_time || entries[i].start_time);
          const nextStart = new Date(entries[i+1].start_time);
          
          const gapMin = Math.floor((nextStart.getTime() - currentEnd.getTime()) / 60000);
          
          if (gapMin > 15) { // Gap > 15 mins considered "Idle/Break"
            totalIdleMin += gapMin;
            userGaps.push({
              id: `${userId}_${i}`,
              name: entries[i].users?.full_name || 'Unknown',
              avatar: entries[i].users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entries[i].users?.full_name || 'U')}&background=random`,
              status: 'offline',
              startTime: currentEnd.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
              endTime: nextStart.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
              duration: `${Math.floor(gapMin / 60)}h ${gapMin % 60}m`,
              durationMinutes: gapMin,
              reason: 'Unaccounted Gap'
            });
          }
        }
      });

      setIdleTime(userGaps);
      setStats({
        totalIdleTime: `${Math.floor(totalIdleMin / 60)}h`,
        avgIdlePerUser: userGaps.length > 0 ? `${Math.floor(totalIdleMin / Object.keys(userEntries).length)}m` : '0m',
        idleAlerts: userGaps.filter(g => g.durationMinutes > 60).length
      });

    } catch (err) {
      console.error('Idle time error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdleTimeData();
  }, []);

  const filteredData = idleTime.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Idle Time</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Idle Time</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Idle Time</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalIdleTime}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Per User</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgIdlePerUser}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Idle Alerts</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.idleAlerts}</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-8 transition-colors duration-500`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className={`p-2.5 border rounded-lg ${darkMode ? 'bg-black border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`} title="Export PDF">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Analysing inactivity gaps...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Start Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>End Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Idle Duration</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reason</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</h4>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-500">{record.startTime}</td>
                  <td className="p-4 text-sm font-medium text-gray-500">{record.endTime}</td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.duration}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      {record.reason}
                    </span>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500 font-bold">No significant idle time detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
