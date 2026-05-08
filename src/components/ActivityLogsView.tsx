import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, LogIn, FileText, MessageSquare, 
  BarChart2, CreditCard, UserPlus, CheckCircle,
  Clock, Bell, Shield, Settings, Info, AlertTriangle
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../context/AppContext';

// Helper to map icon names from DB to Lucide components
const IconMapper = ({ type, size = 18 }: { type: string, size?: number }) => {
  switch (type) {
    case 'LogIn': return <LogIn size={size} />;
    case 'FileText': return <FileText size={size} />;
    case 'MessageSquare': return <MessageSquare size={size} />;
    case 'BarChart2': return <BarChart2 size={size} />;
    case 'CreditCard': return <CreditCard size={size} />;
    case 'UserPlus': return <UserPlus size={size} />;
    case 'CheckCircle': return <CheckCircle size={size} />;
    case 'Clock': return <Clock size={size} />;
    case 'Bell': return <Bell size={size} />;
    case 'Shield': return <Shield size={size} />;
    case 'Settings': return <Settings size={size} />;
    case 'AlertTriangle': return <AlertTriangle size={size} />;
    default: return <Info size={size} />;
  }
};

interface LogItem {
  id: string;
  title: string;
  description: string;
  icon_type: string;
  color: string;
  created_at: string;
}

interface LogGroup {
  date: string;
  items: LogItem[];
}

export default function ActivityLogsView() {
  const { darkMode } = useAppContext();
  const [logs, setLogs] = useState<LogGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group logs by date
      const groups: { [key: string]: LogItem[] } = {};
      
      (data || []).forEach(log => {
        const date = new Date(log.created_at);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        if (date.toDateString() === today.toDateString()) {
          dateStr = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          dateStr = 'Yesterday';
        }

        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(log);
      });

      const formattedGroups = Object.keys(groups).map(date => ({
        date,
        items: groups[date]
      }));

      setLogs(formattedGroups);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Subscribe to new logs
    const channel = supabase.channel('activity-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Activity Logs</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Activity Logs</span>
        </div>
      </div>

      <div className="max-w-6xl">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-black text-gray-600 border border-gray-800' : 'bg-gray-100 text-gray-400'}`}>
              <Bell size={40} />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No activities yet</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>System events and user actions will appear here as they happen.</p>
          </div>
        ) : (
          logs.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-10 last:mb-0">
              <div className="mb-6">
                <span className={`${darkMode ? 'bg-black text-gray-300 border-gray-800' : 'bg-gray-200 text-gray-700'} border px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider`}>
                  {group.date}
                </span>
              </div>

              <div className={`relative ml-4 pl-8 border-l border-dashed ${darkMode ? 'border-gray-800' : 'border-gray-200'} space-y-8`}>
                {group.items.map((item, itemIdx) => (
                  <div key={item.id} className="relative group/log">
                    {/* Timeline Dot/Icon */}
                    <div className={`absolute -left-[49px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${item.color || 'bg-blue-600'} z-10 transition-transform group-hover/log:scale-110`}>
                      <IconMapper type={item.icon_type} />
                    </div>

                    <div className="pt-0.5">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed max-w-4xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {logs.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <button className={`${darkMode ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' : 'bg-black hover:bg-gray-800'} text-white px-8 py-3 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95 uppercase tracking-widest`}>
              Load More Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
