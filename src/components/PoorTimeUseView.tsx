import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  AlertCircle, ExternalLink, Filter, ChevronDown, 
  Download, Printer, BarChart3, TrendingDown,
  ShieldAlert, Info, MoreVertical, Loader2, Globe
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const poorTimeData: any[] = [];

export default function PoorTimeUseView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [poorTime, setPoorTime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [stats, setStats] = useState({
    totalWasteTime: '0h',
    highSeverity: 0,
    topDistraction: 'None'
  });

  const fetchPoorTimeData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs' as any)
        .select(`
          *,
          users:user_id (full_name, avatar_url, last_seen)
        `)
        .eq('is_productive', false)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('not found')) {
          setPoorTime([]); 
        } else {
          throw error;
        }
      } else {
        const formatted = (data || []).map(entry => {
          const lastSeenDate = entry.users?.last_seen ? new Date(entry.users.last_seen) : null;
          const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;
          
          const h = Math.floor(entry.duration_seconds / 3600);
          const m = Math.floor((entry.duration_seconds % 3600) / 60);
          const s = entry.duration_seconds % 60;

          return {
            id: entry.id,
            name: entry.users?.full_name || 'Unknown',
            avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
            status: isOnline ? 'online' : 'offline',
            website: entry.activity_name || 'Unknown',
            browser: entry.browser || 'Unknown',
            dateTime: new Date(entry.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
            duration: `${h}h ${m}m ${s}s`,
            durationSeconds: entry.duration_seconds,
            category: entry.category || 'Other',
            severity: entry.duration_seconds > 1800 ? 'High' : 'Medium'
          };
        });

        setPoorTime(formatted);
        const totalSec = formatted.reduce((acc, curr) => acc + curr.durationSeconds, 0);
        setStats({
          totalWasteTime: `${Math.floor(totalSec / 3600)}h`,
          highSeverity: formatted.filter(u => u.severity === 'High').length,
          topDistraction: formatted.length > 0 ? formatted[0].website : 'None'
        });
      }

    } catch (err) {
      console.error('Poor time error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPoorTimeData();
  }, []);

  const filteredData = poorTime.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.website.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Poor Time Use</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Poor Time Use</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Distraction Time</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalWasteTime}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Distraction</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.topDistraction}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Severity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.highSeverity}</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees or websites..." 
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
              <select className={`appearance-none border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[180px] ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`} value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option>All Employees</option>
                {Array.from(new Set(poorTime.map(d => d.name))).map(name => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Scanning activity logs for distractions...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Website / App</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Severity</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                      </div>
                      <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</h4>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ExternalLink size={14} className="text-blue-500" />
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{record.website}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{record.dateTime}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.duration}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      record.severity === 'High' ? (darkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600') :
                      (darkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-50 text-amber-600')
                    }`}>
                      {record.severity}
                    </span>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500 font-bold">
                    <div className="flex flex-col items-center gap-2">
                      <ShieldAlert className="w-8 h-8 text-blue-600 mb-2" />
                      <p>No distraction logs found.</p>
                      <p className="text-xs font-normal text-gray-400 max-w-xs">Integrated tracking agent is required to monitor usage in real-time.</p>
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
