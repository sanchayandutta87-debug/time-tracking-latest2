import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, ShieldAlert, 
  AlertTriangle, Info, Filter, ChevronDown, Eye, 
  CheckCircle2, XCircle, MoreVertical, Download, Printer, Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const unusualActivityData: any[] = [];

export default function UnusualActivityView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [unusual, setUnusual] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSeverity, setActiveSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [stats, setStats] = useState({
    highSeverity: 0,
    totalFlags: 0,
    avgResolveTime: '15m'
  });

  const fetchUnusualActivity = async () => {
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
        .eq('is_manual', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(entry => {
        const lastSeenDate = entry.users?.last_seen ? new Date(entry.users.last_seen) : null;
        const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

        return {
          id: entry.id,
          name: entry.users?.full_name || 'Unknown',
          avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
          status: isOnline ? 'online' : 'offline',
          activity: 'Manual time entry detected. User added time without live tracking.',
          totalTime: `${Math.floor(entry.duration_seconds / 60)}m`,
          severity: entry.duration_seconds > 3600 ? 'High' : 'Medium',
          timestamp: new Date(entry.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };
      });

      setUnusual(formatted);
      setStats({
        highSeverity: formatted.filter(u => u.severity === 'High').length,
        totalFlags: formatted.length,
        avgResolveTime: '12m'
      });

    } catch (err) {
      console.error('Unusual activity error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnusualActivity();
  }, []);

  const filteredData = unusual.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = activeSeverity === 'All' || record.severity === activeSeverity;
    const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
    return matchesSearch && matchesSeverity && matchesEmployee;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return (darkMode ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100');
      case 'medium': return (darkMode ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100');
      default: return (darkMode ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100');
    }
  };

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Unusual Activity</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Unusual Activity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Alerts</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalFlags}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Severity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.highSeverity}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resolved Today</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>14</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Resolve Time</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.avgResolveTime}</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-6`}>
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
                {Array.from(new Set(unusual.map(d => d.name))).map(name => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="flex gap-1 p-1 rounded-lg border border-gray-200">
               {['All', 'High', 'Medium', 'Low'].map((sev) => (
                <button key={sev} onClick={() => setActiveSeverity(sev as any)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeSeverity === sev ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400'}`}>{sev}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Scanning for suspicious activities...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Activity Details</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Timestamp</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Severity</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
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
                    <p className={`text-xs max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.activity}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.totalTime}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500">{record.timestamp}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getSeverityColor(record.severity)}`}>
                      {record.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-emerald-500' : 'hover:bg-gray-100 text-emerald-600'}`}>
                        <CheckCircle2 size={16} />
                      </button>
                      <button className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-red-500' : 'hover:bg-gray-100 text-red-600'}`}>
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-500 font-bold">No unusual activities detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
