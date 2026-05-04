import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  Download, Printer, Filter, ChevronDown, Info,
  TrendingUp, BarChart3, Loader2, MousePointer2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const timelineData: any[] = [];

export default function TimelineReportView() {
  const { darkMode } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const timeLabels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const fetchTimelineData = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('time_entries')
        .select(`
          *,
          users:user_id (full_name, avatar_url, last_seen),
          projects (name)
        `)
        .gte('start_time', `${today}T00:00:00Z`)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const userMap: Record<string, any> = {};

      (data || []).forEach(entry => {
        const userId = entry.user_id;
        if (!userMap[userId]) {
          const lastSeenDate = entry.users?.last_seen ? new Date(entry.users.last_seen) : null;
          const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

          userMap[userId] = {
            id: userId,
            name: entry.users?.full_name || 'Unknown',
            avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
            status: isOnline ? 'online' : 'offline',
            startTime: '---',
            endTime: '---',
            project: entry.projects?.name || 'General Work',
            activities: []
          };
        }

        const start = new Date(entry.start_time);
        const end = entry.end_time ? new Date(entry.end_time) : new Date();

        if (userMap[userId].startTime === '---') {
          userMap[userId].startTime = start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        }
        userMap[userId].endTime = end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        userMap[userId].activities.push({
          start: start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          end: end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          type: 'active'
        });
      });

      setTimeline(Object.values(userMap));
    } catch (err) {
      console.error('Timeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const filteredData = timeline.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Timeline Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Timeline Report</span>
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
              <p className="text-sm font-bold text-gray-500">Generating activity timeline...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today's Activity Timeline</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredData.map((record) => (
                <tr key={record.id} className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                  <td className="p-4 w-64">
                    <div className="flex items-center gap-3">
                      <img src={record.avatar} alt={record.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{record.name}</h4>
                        <span className="text-[10px] text-gray-400">{record.startTime} - {record.endTime}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <div className={`h-8 w-full rounded-lg relative overflow-hidden flex gap-0.5 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {record.activities.map((act: any, idx: number) => {
                          const s = act.start.split(':');
                          const e = act.end.split(':');
                          const startMin = parseInt(s[0]) * 60 + parseInt(s[1]);
                          const endMin = parseInt(e[0]) * 60 + parseInt(e[1]);
                          const startPercent = ((startMin - 480) / 720) * 100;
                          const widthPercent = ((endMin - startMin) / 720) * 100;

                          return (
                            <div 
                              key={idx}
                              className="absolute h-full bg-blue-600 opacity-80"
                              style={{ left: `${Math.max(0, startPercent)}%`, width: `${Math.max(1, widthPercent)}%` }}
                            />
                          );
                        })}
                      </div>
                      <div className="flex justify-between mt-2">
                        {timeLabels.filter((_, i) => i % 2 === 0).map((label, i) => (
                          <span key={i} className="text-[10px] text-gray-400 font-bold">{label}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredData.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-20 text-center text-gray-500 font-bold">No timeline activity found for today.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
