import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  Download, Printer, Filter, ChevronDown, Info,
  TrendingUp, BarChart3, Loader2, MousePointer2,
  ArrowUpRight, ArrowDownRight, FileText
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export const hoursTrackedData: any[] = [];

export default function HoursTrackedView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoursTracked, setHoursTracked] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: '0h',
    activeUsers: 0,
    productivity: '0%'
  });

  const fetchHoursTracked = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          users:user_id (full_name),
          projects (name)
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(entry => {
        const start = new Date(entry.start_time);
        const end = entry.end_time ? new Date(entry.end_time) : new Date();
        const durationSec = entry.duration_seconds || Math.floor((end.getTime() - start.getTime()) / 1000);
        
        return {
          id: entry.id,
          date: start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          userName: entry.users?.full_name || 'Unknown',
          project: entry.projects?.name || 'General Work',
          timeTracked: `${Math.floor(durationSec / 3600)}h ${Math.floor((durationSec % 3600) / 60)}m`,
          durationSec
        };
      });

      setHoursTracked(formatted);
      const totalSec = formatted.reduce((acc, curr) => acc + curr.durationSec, 0);
      setStats({
        totalHours: `${Math.floor(totalSec / 3600)}h`,
        activeUsers: new Set(formatted.map(f => f.userName)).size,
        productivity: '92%'
      });

    } catch (err) {
      console.error('Hours tracked error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHoursTracked();
  }, []);

  const filteredData = hoursTracked.filter(record => 
    record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Hours Tracked</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Hours Tracked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tracked</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.totalHours}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Users</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.activeUsers}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productivity</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.productivity}</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-8`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by user or project..." 
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className={`p-2.5 border rounded-lg ${darkMode ? 'bg-black border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Retrieving tracked hours...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Project</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Tracked</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4 text-sm font-medium text-gray-500">{record.date}</td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.userName}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{record.project}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.timeTracked}</span>
                  </td>
                  <td className="p-4">
                    <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                      <Info size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-500 font-bold">No tracking data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
