import React from 'react';
import {
  ChevronRight, TrendingUp, TrendingDown, Clock, Target,
  CheckCircle, AlertCircle, Calendar, FileText, MoreVertical,
  ArrowUpRight, Timer, Coffee, Zap, Star, Award
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const userStats = [
  {
    title: 'Hours Today',
    value: '6h 45m',
    change: '12%',
    trend: 'up',
    color: '#6366f1',
    icon: <Clock size={18} />,
    data: [
      { value: 4 }, { value: 5 }, { value: 6 },
      { value: 5 }, { value: 7 }, { value: 6 }, { value: 7 }
    ]
  },
  {
    title: 'Tasks Completed',
    value: '24',
    change: '8%',
    trend: 'up',
    color: '#10b981',
    icon: <CheckCircle size={18} />,
    data: [
      { value: 3 }, { value: 5 }, { value: 4 },
      { value: 6 }, { value: 5 }, { value: 7 }, { value: 8 }
    ]
  },
  {
    title: 'Productivity',
    value: '87%',
    change: '5%',
    trend: 'up',
    color: '#f59e0b',
    icon: <Zap size={18} />,
    data: [
      { value: 70 }, { value: 75 }, { value: 80 },
      { value: 78 }, { value: 85 }, { value: 82 }, { value: 87 }
    ]
  },
  {
    title: 'Pending Tasks',
    value: '12',
    change: '3%',
    trend: 'down',
    color: '#ef4444',
    icon: <AlertCircle size={18} />,
    data: [
      { value: 18 }, { value: 16 }, { value: 15 },
      { value: 14 }, { value: 13 }, { value: 12 }, { value: 12 }
    ]
  },
];

const weeklyHoursData = [
  { name: 'Mon', hours: 7.5, target: 8 },
  { name: 'Tue', hours: 8.2, target: 8 },
  { name: 'Wed', hours: 6.8, target: 8 },
  { name: 'Thu', hours: 7.9, target: 8 },
  { name: 'Fri', hours: 8.5, target: 8 },
  { name: 'Sat', hours: 3.2, target: 4 },
  { name: 'Sun', hours: 0, target: 0 },
];

const taskBreakdown = [
  { name: 'Development', value: 45, color: '#6366f1' },
  { name: 'Meetings', value: 15, color: '#f59e0b' },
  { name: 'Code Review', value: 20, color: '#10b981' },
  { name: 'Documentation', value: 10, color: '#ec4899' },
  { name: 'Other', value: 10, color: '#94a3b8' },
];

const recentActivities = [
  { action: 'Completed task', detail: 'UI Design for Dashboard', time: '10 min ago', type: 'complete', color: 'bg-emerald-500' },
  { action: 'Started timer', detail: 'API Integration Module', time: '25 min ago', type: 'timer', color: 'bg-blue-500' },
  { action: 'Submitted timesheet', detail: 'Week 14 - April 2026', time: '1 hour ago', type: 'submit', color: 'bg-purple-500' },
  { action: 'Added to project', detail: 'FlowSpark - Workflow Tools', time: '2 hours ago', type: 'project', color: 'bg-orange-500' },
  { action: 'Leave approved', detail: 'April 25, 2026 - Personal', time: '3 hours ago', type: 'leave', color: 'bg-pink-500' },
  { action: 'Completed task', detail: 'Bug Fix - Login Module', time: '4 hours ago', type: 'complete', color: 'bg-emerald-500' },
];

const upcomingDeadlines = [
  { task: 'Dashboard Redesign', project: 'TaskZen', date: 'Apr 20', priority: 'High', color: 'text-red-500 bg-red-50' },
  { task: 'API Documentation', project: 'CodePulse', date: 'Apr 22', priority: 'Medium', color: 'text-orange-500 bg-orange-50' },
  { task: 'Unit Testing', project: 'Corelytics', date: 'Apr 25', priority: 'Low', color: 'text-blue-500 bg-blue-50' },
  { task: 'Client Presentation', project: 'FlowSpark', date: 'Apr 28', priority: 'High', color: 'text-red-500 bg-red-50' },
  { task: 'Performance Review', project: 'HR', date: 'Apr 30', priority: 'Medium', color: 'text-orange-500 bg-orange-50' },
];

const myProjects = [
  { name: 'TaskZen - Productivity', role: 'Lead Developer', progress: 75, color: '#6366f1' },
  { name: 'FlowSpark - Workflow', role: 'Frontend Dev', progress: 45, color: '#f59e0b' },
  { name: 'Corelytics - Analytics', role: 'Full Stack', progress: 90, color: '#10b981' },
  { name: 'CodePulse - Cloud', role: 'Backend Dev', progress: 30, color: '#ec4899' },
];

const productivityTrend = [
  { name: 'Week 1', score: 72 },
  { name: 'Week 2', score: 78 },
  { name: 'Week 3', score: 75 },
  { name: 'Week 4', score: 82 },
  { name: 'Week 5', score: 80 },
  { name: 'Week 6', score: 85 },
  { name: 'Week 7', score: 87 },
];

const achievements = [
  { title: 'Early Bird', desc: 'Logged in before 9 AM for 5 days', icon: <Star size={16} />, earned: true },
  { title: 'Streak Master', desc: '7-day productivity streak', icon: <Zap size={16} />, earned: true },
  { title: 'Team Player', desc: 'Completed 10 collaborative tasks', icon: <Award size={16} />, earned: true },
  { title: 'Focus Mode', desc: '4 hours uninterrupted work', icon: <Target size={16} />, earned: false },
];

export default function UserDashboardView({ isRTL = false, isDarkMode = false }: { isRTL?: boolean, isDarkMode?: boolean }) {
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
          {userStats.map((stat, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex flex-col`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`p-1.5 rounded-lg`} style={{ backgroundColor: `${stat.color}15` }}>
                      <span style={{ color: stat.color }}>{stat.icon}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400">{stat.title}</p>
                  </div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</h3>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.data}>
                      <defs>
                        <linearGradient id={`user-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stat.color} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={stat.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={stat.color}
                        fillOpacity={1}
                        fill={`url(#user-gradient-${i})`}
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
                <span className="text-[10px] text-gray-400 font-medium">vs last week</span>
              </div>
            </div>
          ))}
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
                <BarChart data={weeklyHoursData} margin={{ top: 0, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#1f2937" : "#f3f4f6"} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} reversed={isRTL} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip cursor={{ fill: isDarkMode ? '#1f2937' : '#f9fafb' }} />
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
                    data={taskBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskBreakdown.map((entry, index) => (
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
              {taskBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-500 font-medium">{item.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: Recent Activities + Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Activities */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-5 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activities</h3>
              <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-5">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full ${activity.color} shrink-0 mt-1`} />
                    {i < recentActivities.length - 1 && (
                      <div className={`w-px flex-1 mt-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{activity.action}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{activity.detail}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-3 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Upcoming Deadlines</h3>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, i) => (
                <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#0a0a1a]/50' : 'bg-gray-50/80'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{deadline.task}</h4>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${deadline.color}`}>{deadline.priority}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-400 font-medium">{deadline.project}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar size={10} />
                      <span>{deadline.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Projects */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Projects</h3>
            <div className="space-y-5">
              {myProjects.map((project, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.name}</h4>
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

        {/* Fourth Row: Productivity Trend + Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Productivity Trend */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-8 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Productivity Trend</h3>
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold">+15% this month</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityTrend} margin={{ top: 0, right: isRTL ? -20 : 0, left: isRTL ? 0 : -20, bottom: 0 }}>
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
                    dot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievements */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Achievements</h3>
            <div className="space-y-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    achievement.earned
                      ? isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-100'
                      : isDarkMode ? 'bg-gray-800/30 border border-gray-800 opacity-50' : 'bg-gray-50 border border-gray-100 opacity-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    achievement.earned
                      ? 'bg-indigo-500 text-white'
                      : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{achievement.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{achievement.desc}</p>
                  </div>
                  {achievement.earned && (
                    <CheckCircle size={16} className="text-emerald-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm`}>
          <h3 className={`text-base font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20' : 'bg-indigo-50 hover:bg-indigo-100 border border-indigo-100'}`}>
              <Timer size={20} className="text-indigo-500" />
              <div className="text-left">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Start Timer</p>
                <p className="text-[10px] text-gray-400">Track your time</p>
              </div>
            </button>
            <button className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20' : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-100'}`}>
              <FileText size={20} className="text-emerald-500" />
              <div className="text-left">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Timesheet</p>
                <p className="text-[10px] text-gray-400">Submit hours</p>
              </div>
            </button>
            <button className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20' : 'bg-orange-50 hover:bg-orange-100 border border-orange-100'}`}>
              <Coffee size={20} className="text-orange-500" />
              <div className="text-left">
                <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Break</p>
                <p className="text-[10px] text-gray-400">Take a break</p>
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
    </div>
  );
}
