import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  Download, Printer, Filter, ChevronDown, Info,
  TrendingDown, BarChart3, Loader2, MousePointer2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const lowActivityData: any[] = [];

export default function LowActivityView() {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [lowActivity, setLowActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [stats, setStats] = useState({
    avgActivity: '0%',
    lowActivityUsers: 0,
    alertsSent: 0
  });

  const fetchLowActivityData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select(`
          *,
          users:user_id (
            full_name,
            avatar_url,
            last_seen
          )
        `)
        .eq('date', today);

      if (attError) throw attError;

      const { data: entries, error: entError } = await supabase
        .from('time_entries')
        .select('*')
        .gte('start_time', `${today}T00:00:00Z`);

      if (entError) throw entError;

      const formatted = (attendance || []).map(att => {
        const userEntries = (entries || []).filter(e => e.user_id === att.user_id);
        const totalTrackedSec = userEntries.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        
        // Simulating activity score based on tracking consistency
        // If they have large gaps, score is lower
        let score = totalTrackedSec > 0 ? 85 : 0;
        if (totalTrackedSec > 0 && totalTrackedSec < 14400) score = 45; // < 4 hours
        if (totalTrackedSec > 0 && totalTrackedSec < 3600) score = 15; // < 1 hour

        const lastSeenDate = att.users?.last_seen ? new Date(att.users.last_seen) : null;
        const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

        return {
          id: att.id,
          name: att.users?.full_name || 'Unknown',
          avatar: att.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(att.users?.full_name || 'U')}&background=random`,
          status: isOnline ? 'online' : 'offline',
          activityScore: score,
          totalTime: `${Math.floor(totalTrackedSec / 3600)}h ${Math.floor((totalTrackedSec % 3600) / 60)}m`,
          lastActive: lastSeenDate ? lastSeenDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Never'
        };
      });

      setLowActivity(formatted);
      setStats({
        avgActivity: formatted.length > 0 ? `${Math.floor(formatted.reduce((acc, curr) => acc + curr.activityScore, 0) / formatted.length)}%` : '0%',
        lowActivityUsers: formatted.filter(u => u.activityScore < 30).length,
        alertsSent: 0
      });

    } catch (err) {
      console.error('Low activity error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLowActivityData();
  }, []);

  const filteredData = lowActivity.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Low Activity</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Low Activity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <MousePointer2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg. Activity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgActivity}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Activity Users</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.lowActivityUsers}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alerts Sent</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.alertsSent}</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-8`}>
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
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
              <select className={`appearance-none border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[160px] ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option>All Employees</option>
                {lowActivity.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
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
              <p className="text-sm font-bold text-gray-500">Calculating activity scores...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activity Score</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Time</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last Active</th>
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
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${record.activityScore < 30 ? 'bg-red-500' : record.activityScore < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${record.activityScore}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${record.activityScore < 30 ? 'text-red-500' : record.activityScore < 60 ? 'text-amber-500' : 'text-emerald-500'}`}>{record.activityScore}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{record.totalTime}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500">{record.lastActive}</span>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500 font-bold">No activity data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
