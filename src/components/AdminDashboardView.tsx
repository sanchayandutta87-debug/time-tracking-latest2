import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import { 
  ChevronRight, TrendingUp, TrendingDown, UserCheck, 
  UserX, MoreVertical, Plus, Check, X, 
  ExternalLink, Clock, Globe, Monitor, Smartphone,
  LayoutDashboard, Users, UserPlus, Box, List, Grid, Menu, Bell, Moon,
  Loader2, Edit2
} from 'lucide-react';
import AddEmployeeModal from './AddEmployeeModal';
import { 
  ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboardView({ isRTL = false }: { isRTL?: boolean }) {
  const { darkMode: isDarkMode } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  
  // Dynamic States
  const [stats, setStats] = useState<any[]>([]);
  const [topMembers, setTopMembers] = useState<any[]>([]);
  const [requestApproval, setRequestApproval] = useState<any[]>([]);
  const [projectStatsData, setProjectStatsData] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [membersTable, setMembersTable] = useState<any[]>([]);
  const [projectWorkforce, setProjectWorkforce] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDesignation, setNewDesignation] = useState('');

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Projects first
      const { data: allProjects } = await supabase.from('projects').select('*');
      const projectsList = allProjects || [];

      // 2. Fetch Time Entries with joins
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select(`
            *,
            projects (name),
            users (
              full_name, 
              avatar_url, 
              teams (name)
            )
        `)
        .gte('start_time', sevenDaysAgo.toISOString());

      const entries = timeEntries || [];

      // 3. Stats Calculation with Live Time support
      const nowTime = new Date().getTime();
      const calculateDuration = (entry: any) => {
        if (entry.duration_seconds) return entry.duration_seconds;
        if (entry.start_time && !entry.end_time) {
          return Math.floor((nowTime - new Date(entry.start_time).getTime()) / 1000);
        }
        return 0;
      };

      const totalSeconds = entries.reduce((acc, curr) => acc + calculateDuration(curr), 0);
      const manualSeconds = entries.filter(e => e.is_manual).reduce((acc, curr) => acc + calculateDuration(curr), 0);
      
      const formatDuration = (sec: number) => {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return `${h}h ${m}m`;
      };

      // Aggregate data for last 7 days charts
      const dailyData: { [key: string]: { total: number, manual: number } } = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dailyData[d.toISOString().split('T')[0]] = { total: 0, manual: 0 };
      }

      entries.forEach(e => {
        const dateStr = new Date(e.start_time).toISOString().split('T')[0];
        if (dailyData[dateStr]) {
          const dur = calculateDuration(e);
          dailyData[dateStr].total += dur;
          if (e.is_manual) dailyData[dateStr].manual += dur;
        }
      });

      const chartDates = Object.keys(dailyData).sort();
      const workingHoursSeries = chartDates.map(date => ({ value: Math.round(dailyData[date].total / 3600 * 10) / 10 }));
      const productionSeries = chartDates.map(date => ({ value: Math.round((dailyData[date].total - dailyData[date].manual) / 3600 * 10) / 10 }));
      const manualSeries = chartDates.map(date => ({ value: Math.round(dailyData[date].manual / 3600 * 10) / 10 }));

      setStats([
        { title: 'Working Hours', value: formatDuration(totalSeconds), change: 'Live', trend: 'up', color: '#3b82f6', data: workingHoursSeries },
        { title: 'Production', value: formatDuration(totalSeconds - manualSeconds), change: 'Live', trend: 'up', color: '#f97316', data: productionSeries },
        { title: 'Unproductive', value: '0h 0m', change: '0%', trend: 'down', color: '#ef4444', data: [ { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 } ] },
        { title: 'Manual Added', value: formatDuration(manualSeconds), change: 'Live', trend: 'up', color: '#10b981', data: manualSeries },
      ]);

      // 4. Project Statistics
      const activeCount = projectsList.filter(p => p.status === 'active' || p.status === 'in_progress' || !p.status).length;
      const onHoldCount = projectsList.filter(p => p.status === 'on_hold').length;
      const completedCount = projectsList.filter(p => p.status === 'completed').length;

      setProjectStatsData([
        { name: 'Overview', active: activeCount, inprogress: onHoldCount, completed: completedCount }
      ]);

      setRecentProjects(projectsList.slice(0, 5).map(p => ({ 
        id: p.id,
        name: p.name, 
        budget: `$${p.budget || 0}`, 
        icon: p.name.substring(0, 2).toUpperCase(), 
        color: 'bg-blue-100 text-blue-600' 
      })));

      // 5. Aggregate Project Workforce
      const pWorkforceMap: any = {};
      
      // Initialize with all projects using ID as key
      projectsList.forEach(p => {
        pWorkforceMap[p.id] = { name: p.name, members: {} };
      });
      pWorkforceMap['internal'] = { name: 'Internal', members: {} };

      entries.forEach((e: any) => {
        const projData = Array.isArray(e.projects) ? e.projects[0] : e.projects;
        const userData = Array.isArray(e.users) ? e.users[0] : e.users;
        const teamData = userData ? (Array.isArray(userData.teams) ? userData.teams[0] : userData.teams) : null;

        const pId = e.project_id || 'internal';
        const uName = userData?.full_name || 'Unknown';
        const tName = teamData?.name || 'No Team';
        
        if (!pWorkforceMap[pId]) {
          pWorkforceMap[pId] = { name: projData?.name || 'Internal', members: {} };
        }
        
        if (!pWorkforceMap[pId].members[uName]) {
          pWorkforceMap[pId].members[uName] = { 
            time: 0, 
            avatar: userData?.avatar_url, 
            team: tName,
            startDate: e.start_time 
          };
        } else {
          if (new Date(e.start_time) < new Date(pWorkforceMap[pId].members[uName].startDate)) {
            pWorkforceMap[pId].members[uName].startDate = e.start_time;
          }
        }
        pWorkforceMap[pId].members[uName].time += calculateDuration(e);
      });

      const formattedWorkforce = Object.values(pWorkforceMap)
        .map((data: any) => ({
          projectName: data.name,
          members: Object.entries(data.members).map(([uName, mData]: [string, any]) => ({
            name: uName,
            time: formatDuration(mData.time),
            team: mData.team,
            avatar: mData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(uName)}&background=random`,
            startDate: new Date(mData.startDate).toLocaleDateString()
          }))
        }))
        .filter(pw => pw.projectName !== 'Internal' || pw.members.length > 0)
        .sort((a, b) => b.members.length - a.members.length);
      
      setProjectWorkforce(formattedWorkforce);

      // 6. Users Table & Top Members
      const { data: usersData } = await supabase.from('users').select('*');
      console.log('Fetched Users Data from DB:', usersData);
      const allUsers = usersData || [];
      const now = new Date();

      // Fetch currently active entries for "Tracking Now" status
      const { data: currentActive } = await supabase
        .from('time_entries')
        .select('user_id')
        .is('end_time', null);
      
      const activeUserIds = new Set((currentActive || []).map(e => e.user_id));

      setTopMembers(allUsers.map(user => ({
        name: user.full_name,
        role: user.job_title || 'Employee',
        salary: `$${Math.floor(Math.random() * 5000) + 3000}`,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`,
        totalTime: entries.filter(e => e.user_id === user.id).reduce((acc, curr) => acc + calculateDuration(curr), 0)
      })).sort((a, b) => b.totalTime - a.totalTime).slice(0, 5));

      const tableData = allUsers.map(u => {
        const lastSeen = u.last_seen ? new Date(u.last_seen) : null;
        const diffMinutes = lastSeen ? (now.getTime() - lastSeen.getTime()) / (1000 * 60) : 999;
        const isTracking = activeUserIds.has(u.id);
        const status = isTracking ? 'Tracking Now' : (diffMinutes < 15 ? 'Active' : 'Offline');
        
        return {
          id: u.id,
          name: u.full_name,
          designation: u.job_title || 'N/A',
          actualRole: u.role || 'Employee',
          email: u.email,
          phone: u.phone || 'N/A',
          status: status,
          isTracking: isTracking,
          avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name)}&background=random`
        };
      });

      // Sort: Tracking Now > Active > Offline
      const statusPriority: any = { 'Tracking Now': 0, 'Active': 1, 'Offline': 2 };
      tableData.sort((a, b) => {
        if (a.status !== b.status) {
          return (statusPriority[a.status] ?? 99) - (statusPriority[b.status] ?? 99);
        }
        return a.name.localeCompare(b.name);
      });

      setMembersTable(tableData);

      // 7. Request Approval (Leave Requests + Manual Time)
      const { data: leaveRequests } = await supabase
        .from('leave_requests')
        .select('*, users(full_name, avatar_url)')
        .eq('status', 'pending')
        .limit(5);

      const { data: manualEntries, error: manualError } = await supabase
        .from('time_entries')
        .select('*, users(full_name, avatar_url)')
        .eq('is_manual', true)
        .eq('status', 'pending')
        .limit(5);
      
      if (manualError) {
        console.warn('Manual entries status column missing or query failed:', manualError.message);
      }
      
      const allReqs = [
        ...(leaveRequests || []).map(r => ({ 
          id: r.id, 
          type: 'leave', 
          category: r.type, 
          name: r.users?.full_name, 
          date: new Date(r.start_date).toLocaleDateString(), 
          avatar: r.users?.avatar_url 
        })),
        ...(manualEntries || []).map(e => ({ 
          id: e.id, 
          type: 'manual_time', 
          category: 'Manual Time', 
          name: e.users?.full_name, 
          date: new Date(e.start_time).toLocaleDateString(), 
          avatar: e.users?.avatar_url 
        }))
      ].slice(0, 5);
      setRequestApproval(allReqs);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Real-time subscription
    const channel = supabase.channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'time_entries' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leave_requests' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchDashboardData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchDashboardData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-lg font-bold animate-pulse">Synchronizing Dashboard...</p>
      </div>
    );
  }

  const radarData = [
    { subject: '2025', A: 120, B: 110, fullMark: 150 },
    { subject: '2026', A: 98, B: 130, fullMark: 150 },
    { subject: '2027', A: 86, B: 130, fullMark: 150 },
    { subject: '2028', A: 99, B: 100, fullMark: 150 },
    { subject: '2029', A: 85, B: 90, fullMark: 150 },
  ];

  const topTeams = [
    { name: 'UX Research', hours: '312h', productivity: '97%', icon: 'UR', color: 'bg-purple-100 text-purple-600' },
    { name: 'Testing', hours: '287h', productivity: '94%', icon: 'TS', color: 'bg-orange-100 text-orange-600' },
    { name: 'Design', hours: '243h', productivity: '92%', icon: 'DN', color: 'bg-emerald-100 text-emerald-600' },
    { name: 'DevOps', hours: '259h', productivity: '91%', icon: 'DO', color: 'bg-pink-100 text-pink-600' },
    { name: 'IT Support', hours: '243h', productivity: '88%', icon: 'IT', color: 'bg-orange-100 text-orange-600' },
  ];

  const handleAction = async (id: string, type: 'leave' | 'manual_time', action: 'approved' | 'rejected') => {
    try {
      const table = type === 'leave' ? 'leave_requests' : 'time_entries';
      console.log(`Attempting to ${action} ${type} request with ID: ${id}`);

      const { error } = await supabase
        .from(table)
        .update({ status: action })
        .eq('id', id);

      if (error) {
        console.error(`Supabase error during ${action}:`, error);
        throw error;
      }

      console.log(`Successfully ${action} ${type} request`);
      await fetchDashboardData(); // Refresh local state
      
      // Provide immediate visual feedback via a small notification would be better, 
      // but for now we'll stick to basic alerts or just let the refresh handle it.
    } catch (error: any) {
      console.error(`Detailed error during ${action} request:`, error);
      alert(`Action Failed: ${error.message || 'Unknown error'}. Please ensure the database schema is updated.`);
    }
  };

  const handleSaveEmployee = async (employeeData: any) => {
    // Refresh data after saving
    await fetchDashboardData();
  };

  const handleUpdateDesignation = async (userId: string) => {
    if (!newDesignation.trim()) {
      setEditingId(null);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ job_title: newDesignation.trim() })
        .eq('id', userId);
      
      if (error) throw error;
      
      setEditingId(null);
      await fetchDashboardData();
    } catch (error: any) {
      alert(`Failed to update designation: ${error.message}`);
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    console.log('--- ROLE UPDATE START ---');
    console.log('User ID:', userId);
    console.log('Target Role:', role);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: role })
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('Supabase Update Error:', error);
        alert(`Database Error: ${error.message}`);
        return;
      }
      
      console.log('Supabase Update Response:', data);
      console.log('--- ROLE UPDATE SUCCESS ---');
      
      await fetchDashboardData();
    } catch (error: any) {
      console.error('Unexpected Role Update Exception:', error);
      alert(`Unexpected Error: ${error.message}`);
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 lg:mb-10 px-4 lg:px-6 pt-4 shrink-0">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          Admin Dashboard
        </h1>
      </div>

      <div className="px-4 lg:px-6 pb-12 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">{stat.title}</p>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</h3>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.data}>
                      <defs>
                        <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stat.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={stat.color} 
                        fillOpacity={1} 
                        fill={`url(#gradient-${i})`} 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${stat.trend === 'up' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {stat.change}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">in Last 7 Days</span>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Members */}
          <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Top Members</h3>
            <div className="space-y-6">
              {topMembers.map((member, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-[10px] text-gray-400 font-medium">Salary</p>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.salary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members Overview (Radar Chart) */}
          <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Members Overview</h3>
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-[10px] font-medium text-gray-400">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] font-medium text-gray-400">Male</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Female" dataKey="A" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                  <Radar name="Male" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Request Approval */}
          <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Request Approval</h3>
            <div className="space-y-6">
              {requestApproval.length > 0 ? requestApproval.map((req, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{req.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter ${req.type === 'leave' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {req.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">{req.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(req.id, req.type, 'approved')}
                      className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      onClick={() => handleAction(req.id, req.type, 'rejected')}
                      className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No pending requests</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Project Statistics (Bar Chart) */}
          <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} lg:col-span-7 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Project Statistics</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-medium text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400">On Hold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-gray-400">Completed</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectStatsData} margin={{ top: 0, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} reversed={isRTL} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip cursor={{ fill: isDarkMode ? '#1f2937' : '#f9fafb' }} />
                  <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="inprogress" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Projects */}
          <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} lg:col-span-5 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Projects</h3>
            <div className="space-y-6">
              {recentProjects.map((project, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedProject(projectWorkforce.find(pw => pw.projectName === project.name) || { projectName: project.name, members: [] })}
                  className={`flex justify-between items-center p-3 rounded-xl cursor-pointer transition-all ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-gray-800/50' : project.color}`}>
                      <span className={isDarkMode ? project.color.split(' ')[1] : ''}>{project.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <Box size={10} /> {project.budget}
                      </p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {(projectWorkforce.find(pw => pw.projectName === project.name)?.members || []).slice(0, 3).map((member: any, i: number) => (
                      <img 
                        key={i} 
                        src={member.avatar} 
                        alt={member.name}
                        className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} object-cover`} 
                        referrerPolicy="no-referrer" 
                      />
                    ))}
                    {(projectWorkforce.find(pw => pw.projectName === project.name)?.members || []).length > 3 && (
                      <div className={`w-6 h-6 rounded-full bg-blue-600 border-2 flex items-center justify-center text-[8px] font-bold text-white ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                        +{(projectWorkforce.find(pw => pw.projectName === project.name)?.members || []).length - 3}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200`}>
              <div className={`p-6 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} flex justify-between items-center`}>
                <div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{selectedProject.projectName}</h3>
                  <p className="text-xs text-blue-500 font-black uppercase tracking-wider mt-1">{selectedProject.members.length} Employees Working</p>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="space-y-5">
                  {selectedProject.members.length > 0 ? selectedProject.members.map((member: any, i: number) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-blue-500 transition-all" />
                        <div>
                          <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.team}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className={`text-[10px] font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{member.time}</p>
                        <p className="text-[9px] text-gray-400 font-medium">Since {member.startDate}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-10">
                      <p className="text-sm text-gray-400 font-bold">No active workforce found for this project</p>
                    </div>
                  )}
                </div>
              </div>
              <div className={`p-6 bg-gray-50/50 dark:bg-gray-900/20 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/25"
                >
                  Close Insights
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Members Table */}
        <div className={`${isDarkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Members</h3>
            <button 
              onClick={() => {
                setEditingEmployee(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <Plus size={18} /> Add New
            </button>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className={isDarkMode ? 'bg-black' : 'bg-gray-50/50'}>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Designation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Phone Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
                {membersTable.map((member, i) => (
                  <tr key={i} className={`transition-colors ${isDarkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${member.isTracking ? 'bg-emerald-500 animate-pulse' : (member.status === 'Active' ? 'bg-blue-500' : 'bg-red-500')}`} />
                      </div>
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      {editingId === member.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={newDesignation}
                            onChange={(e) => setNewDesignation(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateDesignation(member.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className={`text-xs p-1 rounded border outline-none focus:ring-1 focus:ring-blue-500 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}
                            autoFocus
                          />
                          <button onClick={() => handleUpdateDesignation(member.id)} className="text-emerald-500 hover:text-emerald-600">
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {
                            setEditingId(member.id);
                            setNewDesignation(member.designation === 'N/A' ? '' : member.designation);
                          }}
                          className={`text-xs font-medium cursor-pointer hover:text-blue-500 transition-colors flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                          title="Click to edit designation"
                        >
                          {member.designation}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                             <Edit2 size={12} className="text-gray-400" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={member.actualRole}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border outline-none cursor-pointer transition-all ${
                          member.actualRole === 'Administrator' 
                            ? (isDarkMode ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' : 'bg-purple-50 text-purple-700 border-purple-200')
                            : (isDarkMode ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200')
                        }`}
                      >
                        <option value="Employee" className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>Employee</option>
                        <option value="Administrator" className={isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}>Administrator</option>
                      </select>
                    </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.email}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      member.isTracking ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600') :
                      member.status === 'Active' ? (isDarkMode ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-blue-500') : 
                      (isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-500')
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={editingEmployee}
      />
    </div>
  );
}
