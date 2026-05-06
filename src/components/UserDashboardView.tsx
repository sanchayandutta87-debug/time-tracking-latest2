import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import {
  ChevronRight, TrendingUp, TrendingDown, Clock, Target,
  CheckCircle, AlertCircle, Calendar, FileText, MoreVertical,
  ArrowUpRight, Timer, Coffee, Zap, Star, Award, X, Image as ImageIcon
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';


export default function UserDashboardView({ isRTL = false, onViewChange }: { isRTL?: boolean, onViewChange?: (view: string) => void }) {
  const { darkMode: isDarkMode } = useAppContext();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [breakElapsed, setBreakElapsed] = useState('00:00:00');

  useEffect(() => {
    let interval: any;
    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - breakStartTime.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setBreakElapsed(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }, 1000);
    } else {
      setBreakElapsed('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakStartTime]);
  const [stats, setStats] = useState({
    hoursToday: '0h 0m',
    productivity: '0%',
    todayTrend: '0%',
    prodTrend: '0%'
  });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const fetchDashboardData = async (isInitial = false) => {
    if (!currentUser) return;
    if (isInitial) setIsLoading(true);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);

      // 1. Fetch Today's Hours
      const { data: todayEntries } = await supabase
        .from('time_entries')
        .select('duration_seconds')
        .eq('user_id', currentUser.id)
        .gte('start_time', today.toISOString());

      const totalSeconds = (todayEntries || []).reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);

      // 2. Fetch Weekly Attendance Data
      const { data: attendanceEntries } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', currentUser.id)
        .gte('date', startOfWeek.toISOString().split('T')[0]);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyMap: any = {};
      
      // Initialize last 7 days
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        const dayName = days[d.getDay()];
        weeklyMap[dayName] = { name: dayName, hours: 0, target: 8 };
      }

      (attendanceEntries || []).forEach(record => {
        const d = new Date(record.date);
        const dayName = days[d.getDay()];
        
        if (weeklyMap[dayName]) {
          if (record.check_in && record.check_out) {
            const checkIn = new Date(record.check_in);
            const checkOut = new Date(record.check_out);
            let diffMs = checkOut.getTime() - checkIn.getTime();
            
            // Subtract break if applicable (mimicking AttendanceView logic exactly)
            let breakMs = 0;
            if (record.break_time === '01h 00m') {
              breakMs = 3600000;
            } else if (!record.break_time && diffMs > 4 * 3600000) {
              breakMs = 3600000;
            }
            
            diffMs = Math.max(0, diffMs - breakMs);
            const hours = Math.max(0, diffMs / 3600000);
            weeklyMap[dayName].hours = Number((weeklyMap[dayName].hours + hours).toFixed(2));
          }
        }
      });

      // 2.1 Project Breakdown (Still needs time_entries for project association)
      const { data: projectEntries } = await supabase
        .from('time_entries')
        .select('duration_seconds, projects(name, color)')
        .eq('user_id', currentUser.id)
        .gte('start_time', startOfWeek.toISOString());

      const projectMap: any = {};
      (projectEntries || []).forEach(entry => {
        const pName = entry.projects?.name || 'Unassigned';
        if (!projectMap[pName]) {
          projectMap[pName] = { name: pName, value: 0, color: entry.projects?.color || '#94a3b8' };
        }
        projectMap[pName].value += (entry.duration_seconds || 0);
      });

      // 3. Recent Activities
      const { data: recentTime } = await supabase
        .from('time_entries')
        .select('*, projects(name)')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const formattedActivities = (recentTime || []).map(entry => ({
        action: entry.is_manual ? 'Manual Entry Added' : 'Timer Completed',
        detail: entry.projects?.name || entry.description || 'General Work',
        time: new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        color: entry.is_manual ? 'bg-amber-500' : 'bg-blue-500',
        screenshot: entry.screenshot_url
      }));

      // 4. My Projects (Projects the user is assigned to via tasks)
      const { data: assignedTasks } = await supabase
        .from('tasks')
        .select('*, projects(*)')
        .eq('assignee_id', currentUser.id);

      const assignedProjectsMap: any = {};
      (assignedTasks || []).forEach(task => {
        if (task.projects) {
          const p = task.projects;
          if (!assignedProjectsMap[p.id]) {
            assignedProjectsMap[p.id] = {
              name: p.name,
              role: currentUser?.role || 'Member',
              progress: p.status === 'completed' ? 100 : Math.floor(Math.random() * 40) + 40, // Mock progress based on status
              color: p.color || '#6366f1'
            };
          }
        }
      });

      const uniqueProjects = Object.values(assignedProjectsMap);

      // 5. Productivity Trend (Last 7 weeks)
      const trend: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (i * 7 + 6));
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));

        const { data: weekTime } = await supabase
          .from('time_entries')
          .select('duration_seconds')
          .eq('user_id', currentUser.id)
          .gte('start_time', weekStart.toISOString())
          .lte('start_time', weekEnd.toISOString());

        const totalWeekSeconds = (weekTime || []).reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        const score = Math.min(100, Math.floor((totalWeekSeconds / (40 * 3600)) * 100)); // Normalized to 40hr week
        
        trend.push({
          name: `Week ${7 - i}`,
          score: score > 0 ? score : 70 + Math.floor(Math.random() * 10) // Fallback for visual
        });
      }

      setStats({
        hoursToday: `${h}h ${m}m`,
        productivity: '85%', 
        todayTrend: '+12%',
        prodTrend: '+5%'
      });
      setWeeklyData(Object.values(weeklyMap));
      setBreakdown(Object.values(projectMap).length > 0 ? Object.values(projectMap) : [{ name: 'General', value: 100, color: '#6366f1' }]);
      setActivities(formattedActivities);
      setProjects(uniqueProjects.length > 0 ? uniqueProjects : [
        { name: 'No Projects Yet', role: 'Track time to see projects', progress: 0, color: '#94a3b8' }
      ]);
      setTrendData(trend);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreakToggle = async () => {
    if (!currentUser) return;

    if (!isOnBreak) {
      // Start Break
      setIsOnBreak(true);
      setBreakStartTime(new Date());
    } else {
      // Stop Break
      const stopTime = new Date();
      const start = breakStartTime || new Date();
      const diffSeconds = Math.floor((stopTime.getTime() - start.getTime()) / 1000);
      
      setIsOnBreak(false);
      setBreakStartTime(null);

      try {
        const today = new Date().toISOString().split('T')[0];
        // Fetch current attendance
        const { data: att } = await supabase
          .from('attendance')
          .select('break_time, id')
          .eq('user_id', currentUser.id)
          .eq('date', today)
          .single();

        if (att) {
          // Parse current break time (e.g., "01h 30m")
          let currentSeconds = 0;
          if (att.break_time) {
            const hMatch = att.break_time.match(/(\d+)h/);
            const mMatch = att.break_time.match(/(\d+)m/);
            if (hMatch) currentSeconds += parseInt(hMatch[1]) * 3600;
            if (mMatch) currentSeconds += parseInt(mMatch[1]) * 60;
          }

          const totalSeconds = currentSeconds + diffSeconds;
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const newBreakStr = `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;

          // Update DB
          await supabase
            .from('attendance')
            .update({ break_time: newBreakStr })
            .eq('id', att.id);
            
          fetchDashboardData(false);
        }
      } catch (error) {
        console.error('Error updating break time:', error);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData(true);
    
    // Refresh data every 5 minutes automatically
    const refreshInterval = setInterval(() => {
      fetchDashboardData(false);
    }, 5 * 60 * 1000);
    
    if (!currentUser) return;

    // Real-time subscription for instant updates
    // Real-time subscription for instant updates
    const timeChannel = supabase.channel(`user-time-${currentUser.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'time_entries',
        filter: `user_id=eq.${currentUser.id}`
      }, () => {
        fetchDashboardData(false);
      })
      .subscribe();

    // Real-time subscription for attendance updates
    const attendanceChannel = supabase.channel(`user-attendance-${currentUser.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'attendance',
        filter: `user_id=eq.${currentUser.id}`
      }, () => {
        fetchDashboardData(false);
      })
      .subscribe();

    // Real-time subscription for task/assignment updates
    const taskChannel = supabase.channel(`user-tasks-${currentUser.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `assignee_id=eq.${currentUser.id}`
      }, () => {
        fetchDashboardData(false);
      })
      .subscribe();

    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(timeChannel);
      supabase.removeChannel(attendanceChannel);
      supabase.removeChannel(taskChannel);
    };
  }, [currentUser]);
  return (
    <div className={`flex flex-col h-full overflow-y-auto ${isDarkMode ? 'bg-[#0a0a1a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4 shrink-0">
        <div>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>User Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Welcome back! Here's your work overview.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Home</span>
          <ChevronRight size={14} className="rtl:rotate-180" />
          <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>User Dashboard</span>
        </div>
      </div>

      <div className="px-6 pb-12 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg bg-indigo-500/10`}>
                    <Clock size={18} className="text-indigo-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-400">Hours Today</p>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.hoursToday}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white`}>
                <TrendingUp size={10} />
                {stats.todayTrend}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">vs last week</span>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex flex-col`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1.5 rounded-lg bg-amber-500/10`}>
                    <Zap size={18} className="text-amber-500" />
                  </div>
                  <p className="text-xs font-medium text-gray-400">Productivity</p>
                </div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.productivity}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white`}>
                <TrendingUp size={10} />
                {stats.prodTrend}
              </div>
              <span className="text-[10px] text-gray-400 font-medium">vs last week</span>
            </div>
          </div>
        </div>

        {/* Second Row: Weekly Hours + Task Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Hours Chart */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-8 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Weekly Hours</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-medium text-gray-400">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-medium text-gray-400">Target</span>
                </div>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 0, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} reversed={isRTL} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#1f2937' : '#f9fafb' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value as number;
                        const h = Math.floor(val);
                        const m = Math.round((val - h) * 60);
                        return (
                          <div className={`${isDarkMode ? 'bg-[#1a1a2e] border-gray-800' : 'bg-white border-gray-100'} p-3 rounded-lg border shadow-xl`}>
                            <p className="text-xs font-bold text-gray-400 mb-1">{payload[0].payload.name}</p>
                            <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                              Hours: {h}h {m}m
                            </p>
                            <p className="text-[10px] text-gray-400">Target: 8h</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="target" fill={isDarkMode ? '#334155' : '#e2e8f0'} radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Breakdown Donut */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Task Breakdown</h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Total</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>100%</p>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              {breakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-500 font-medium">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name === 'General' ? '100%' : 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: Recent Activities + Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activities */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-8 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activities</h3>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {activities.length > 0 ? activities.map((activity, i) => (
                <div 
                  key={i} 
                  className={`flex gap-3 p-2 rounded-lg transition-all ${activity.screenshot ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50' : ''}`}
                  onClick={() => activity.screenshot && setSelectedScreenshot(activity.screenshot)}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${activity.color} shrink-0 mt-1`} />
                    {i < activities.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pb-2 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activity.action}</p>
                      {activity.screenshot && <ImageIcon size={12} className="text-blue-500" />}
                    </div>
                    <p className="text-[11px] text-gray-400 font-medium">{activity.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 col-span-2">No recent activities found.</p>
              )}
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Projects</h3>
            <div className="space-y-5">
              {projects.map((project, i) => (
                <div 
                  key={i} 
                  className="cursor-pointer group/prj hover:bg-gray-100 dark:hover:bg-gray-800/30 p-2 rounded-xl transition-all"
                  onClick={() => onViewChange && onViewChange('projects')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} group-hover/prj:text-blue-500 transition-colors`}>{project.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{project.role}</p>
                    </div>
                    <span className={`text-xs font-bold`} style={{ color: project.color }}>{project.progress}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fourth Row: Productivity Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Productivity Trend */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-12 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Productivity Trend</h3>
              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold">+15% this month</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 0, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} reversed={isRTL} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[60, 100]} orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip />
                  <defs>
                    <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="score" stroke="none" fill="url(#productivityGradient)" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6366f1', stroke: isDarkMode ? '#15152b' : '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: isDarkMode ? '#15152b' : '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={handleBreakToggle}
              className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] ${isOnBreak ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : (isDarkMode ? 'bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20' : 'bg-orange-50 hover:bg-orange-100 border border-orange-100')}`}
            >
              <Coffee size={20} className={isOnBreak ? 'text-white' : 'text-orange-500'} />
              <div className="text-left">
                <p className={`text-xs font-bold ${isOnBreak ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-800')}`}>
                  {isOnBreak ? 'End Break' : 'Break'}
                </p>
                <p className={`text-[10px] ${isOnBreak ? 'text-orange-100' : 'text-gray-400'}`}>
                  {isOnBreak ? breakElapsed : 'Take a break'}
                </p>
              </div>
            </button>
            <button className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20' : 'bg-pink-50 hover:bg-pink-100 border border-pink-100'}`}>
              <Calendar size={20} className="text-pink-500" />
              <div className="text-left">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Leave</p>
                <p className="text-[10px] text-gray-400">Request leave</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-white dark:bg-[#15152b] rounded-2xl overflow-hidden shadow-2xl scale-in-center">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Screenshot Preview</h3>
              <button 
                onClick={() => setSelectedScreenshot(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
            <div className="p-2 bg-gray-900 flex items-center justify-center min-h-[400px]">
              <img 
                src={selectedScreenshot} 
                alt="Activity Screenshot" 
                className="max-w-full max-h-[80vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
