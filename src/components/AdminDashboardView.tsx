import React from 'react';
import { 
  ChevronRight, TrendingUp, TrendingDown, UserCheck, 
  UserX, MoreVertical, Plus, Check, X, 
  ExternalLink, Clock, Globe, Monitor, Smartphone,
  LayoutDashboard, Users, UserPlus, Box, List, Grid, Menu, Bell, Moon
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell
} from 'recharts';

const stats = [
  { 
    title: 'Working Hours', 
    value: '950h 45m', 
    change: '20%', 
    trend: 'up', 
    color: '#3b82f6',
    data: [
      { value: 10 }, { value: 15 }, { value: 12 }, 
      { value: 20 }, { value: 18 }, { value: 25 }, { value: 22 }
    ]
  },
  { 
    title: 'Production', 
    value: '400h 22m', 
    change: '20%', 
    trend: 'down', 
    color: '#f97316',
    data: [
      { value: 25 }, { value: 20 }, { value: 22 }, 
      { value: 15 }, { value: 18 }, { value: 12 }, { value: 15 }
    ]
  },
  { 
    title: 'Unproductive', 
    value: '50h 25m', 
    change: '45%', 
    trend: 'up', 
    color: '#3b82f6',
    data: [
      { value: 10 }, { value: 12 }, { value: 15 }, 
      { value: 18 }, { value: 20 }, { value: 22 }, { value: 25 }
    ]
  },
  { 
    title: 'Manual Added', 
    value: '46h 45m', 
    change: '22%', 
    trend: 'up', 
    color: '#10b981',
    data: [
      { value: 15 }, { value: 18 }, { value: 12 }, 
      { value: 20 }, { value: 22 }, { value: 25 }, { value: 28 }
    ]
  },
];

const topMembers = [
  { name: 'Leon Baxter', role: 'Testing', salary: '$6595', avatar: 'https://picsum.photos/seed/leon/40/40' },
  { name: 'Charles Cline', role: 'Cybersecurity', salary: '$5145', avatar: 'https://picsum.photos/seed/charles/40/40' },
  { name: 'James Higham', role: 'Mobile App', salary: '$7478', avatar: 'https://picsum.photos/seed/higham/40/40' },
  { name: 'Thomas Ward', role: 'Design', salary: '$4589', avatar: 'https://picsum.photos/seed/ward/40/40' },
  { name: 'Aliza Duncan', role: 'Customer Service', salary: '$6987', avatar: 'https://picsum.photos/seed/aliza/40/40' },
];

const radarData = [
  { subject: '2025', A: 120, B: 110, fullMark: 150 },
  { subject: '2026', A: 98, B: 130, fullMark: 150 },
  { subject: '2027', A: 86, B: 130, fullMark: 150 },
  { subject: '2028', A: 99, B: 100, fullMark: 150 },
  { subject: '2029', A: 85, B: 90, fullMark: 150 },
];

const requestApproval = [
  { name: 'Jonathan King', date: '14 Sep 2025', avatar: 'https://picsum.photos/seed/jonathan/40/40' },
  { name: 'Peter Brooks', date: '28 Aug 2025', avatar: 'https://picsum.photos/seed/peter/40/40' },
  { name: 'Cindy Mateo', date: '20 Aug 2025', avatar: 'https://picsum.photos/seed/cindy/40/40' },
  { name: 'Thomas Walsh', date: '10 Aug 2025', avatar: 'https://picsum.photos/seed/walsh/40/40' },
  { name: 'Eliz Hiltner', date: '25 Jul 2025', avatar: 'https://picsum.photos/seed/eliz/40/40' },
];

const projectStatsData = [
  { name: '15 Jan', active: 85, inprogress: 20, completed: 40 },
  { name: '16 Jan', active: 45, inprogress: 70, completed: 40 },
  { name: '17 Jan', active: 85, inprogress: 20, completed: 40 },
  { name: '18 Jan', active: 45, inprogress: 20, completed: 80 },
  { name: '19 Jan', active: 60, inprogress: 20, completed: 48 },
  { name: '20 Jan', active: 25, inprogress: 20, completed: 48 },
  { name: '21 Jan', active: 78, inprogress: 20, completed: 48 },
];

const recentProjects = [
  { name: 'TaskZen - Productivity', tasks: '08 Tasks', budget: '$3500', icon: 'TZ', color: 'bg-blue-100 text-blue-600' },
  { name: 'FlowSpark - Workflow tools', tasks: '32 Tasks', budget: '$8966', icon: 'FS', color: 'bg-orange-100 text-orange-600' },
  { name: 'Corelytics - Data tools', tasks: '56 Tasks', budget: '$7896', icon: 'CL', color: 'bg-pink-100 text-pink-600', extra: '+1' },
  { name: 'CodePulse - Cloud tools', tasks: '40 Tasks', budget: '$4124', icon: 'CP', color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Office Management', tasks: '48 Tasks', budget: '$4578', icon: 'PD', color: 'bg-purple-100 text-purple-600' },
];

const topTeams = [
  { name: 'UX Research', hours: '312h', productivity: '97%', icon: 'UR', color: 'bg-purple-100 text-purple-600' },
  { name: 'Testing', hours: '287h', productivity: '94%', icon: 'TS', color: 'bg-orange-100 text-orange-600' },
  { name: 'Design', hours: '243h', productivity: '92%', icon: 'DN', color: 'bg-emerald-100 text-emerald-600' },
  { name: 'DevOps', hours: '259h', productivity: '91%', icon: 'DO', color: 'bg-pink-100 text-pink-600' },
  { name: 'IT Support', hours: '243h', productivity: '88%', icon: 'IT', color: 'bg-orange-100 text-orange-600' },
];

const webAppUsage = [
  { name: 'Figma', category: 'Design', hours: '36h 40m', progress: 80, color: 'bg-emerald-500' },
  { name: 'Google', category: 'Browser', hours: '24h 40m', progress: 60, color: 'bg-purple-500' },
  { name: 'Adobe illustrator', category: 'Design', hours: '20h 40m', progress: 40, color: 'bg-orange-500' },
  { name: 'Slack', category: 'Communication', hours: '22h 40m', progress: 35, color: 'bg-blue-500' },
  { name: 'Teams', category: 'Communication', hours: '18h 40m', progress: 30, color: 'bg-yellow-500' },
];

const membersTable = [
  { name: 'Shaun Farley', role: 'Usability Specialist', email: 'shaunfarley@example.com', phone: '+1 578 209 4965', experience: '2 years', location: 'Remote', status: 'Active', avatar: 'https://picsum.photos/seed/shaun/40/40' },
  { name: 'Jenny Ellis', role: 'DevOps', email: 'jenny@example.com', phone: '+1 278 301 7284', experience: '5 years', location: 'Office', status: 'Active', avatar: 'https://picsum.photos/seed/jenny/40/40' },
  { name: 'Aliza Duncan', role: 'Data & Analytics', email: 'aliza@example.com', phone: '+1 702 555 0189', experience: '3 years', location: 'Office', status: 'Active', avatar: 'https://picsum.photos/seed/aliza2/40/40' },
  { name: 'Leslie Hensley', role: 'IT Support', email: 'leslie@example.com', phone: '+1 617 555 0134', experience: '9 years', location: 'Remote', status: 'Inactive', avatar: 'https://picsum.photos/seed/leslie/40/40' },
  { name: 'Karen Galvan', role: 'Networking', email: 'karen@example.com', phone: '+1 832 555 0166', experience: '6 years', location: 'Office', status: 'Inactive', avatar: 'https://picsum.photos/seed/karen/40/40' },
];

export default function AdminDashboardView({ isRTL = false, isDarkMode = false }: { isRTL?: boolean, isDarkMode?: boolean }) {
  return (
    <div className={`flex flex-col h-full overflow-y-auto ${isDarkMode ? 'bg-[#0a0a1a]' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 px-6 pt-4 shrink-0">
        <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className={`${isDarkMode ? 'text-gray-500' : 'rtl:text-gray-600 ltr:text-gray-400'}`}>Home</span>
          <ChevronRight size={14} className="rtl:rotate-180" />
          <span className={`${isDarkMode ? 'text-gray-300' : 'rtl:text-gray-400 ltr:text-gray-600'}`}>Admin Dashboard</span>
        </div>
      </div>

      <div className="px-6 pb-12 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex flex-col`}>
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
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Top Members</h3>
            <div className="space-y-6">
              {topMembers.map((member, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
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
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
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
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Request Approval</h3>
            <div className="space-y-6">
              {requestApproval.map((req, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <img src={req.avatar} alt={req.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{req.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{req.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                      <Check size={14} />
                    </button>
                    <button className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Project Statistics (Bar Chart) */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-7 p-6 rounded-xl border shadow-sm`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Project Statistics</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] font-medium text-gray-400">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400">Inprogress</span>
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
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-5 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recent Projects</h3>
            <div className="space-y-6">
              {recentProjects.map((project, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-gray-800/50' : project.color}`}>
                      <span className={isDarkMode ? project.color.split(' ')[1] : ''}>{project.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{project.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                        <List size={10} /> {project.tasks} | <Box size={10} /> {project.budget}
                      </p>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((n) => (
                      <img 
                        key={n} 
                        src={`https://picsum.photos/seed/p${i}${n}/24/24`} 
                        className={`w-6 h-6 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'}`} 
                        referrerPolicy="no-referrer" 
                      />
                    ))}
                    {project.extra && (
                      <div className={`w-6 h-6 rounded-full bg-blue-600 border-2 flex items-center justify-center text-[8px] font-bold text-white ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                        {project.extra}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fourth Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Teams */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Top Teams</h3>
            <div className="space-y-6">
              {topTeams.map((team, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-gray-800/50' : team.color}`}>
                      <span className={isDarkMode ? team.color.split(' ')[1] : ''}>{team.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{team.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">Hours Logged : {team.hours}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{team.productivity}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Productivity</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Task Details (Donut Chart) */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Task Details</h3>
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>496</span>
                <span className="text-[10px] text-gray-400 font-medium">Ongoing</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>165</span>
                <span className="text-[10px] text-gray-400 font-medium">On hold</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>127</span>
                <span className="text-[10px] text-gray-400 font-medium">Completed</span>
              </div>
            </div>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Ongoing', value: 496 },
                      { name: 'On hold', value: 165 },
                      { name: 'Completed', value: 127 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#3b82f6" />
                    <Cell fill={isDarkMode ? "#334155" : "#64748b"} />
                    <Cell fill="#ec4899" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-[10px] text-gray-400 font-medium">Total Task</p>
                <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>788</p>
              </div>
            </div>
          </div>

          {/* Top Web App & Usage */}
          <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} lg:col-span-4 p-6 rounded-xl border shadow-sm`}>
            <h3 className={`text-base font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Top Web App & Usage</h3>
            <div className="space-y-6">
              {webAppUsage.map((app, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'}`}>
                        {app.name === 'Figma' ? <Grid size={18} /> : app.name === 'Google' ? <Globe size={18} /> : app.name === 'Teams' ? <Users size={18} /> : <Box size={18} />}
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{app.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{app.category}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{app.hours}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`h-full ${app.color}`} style={{ width: `${app.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className={`${isDarkMode ? 'bg-[#15152b] border-gray-800' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Members</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              <Plus size={18} /> Add New
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className={isDarkMode ? 'bg-[#0a0a1a]/50' : 'bg-gray-50/50'}>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Designation</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Phone Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Experience</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Work Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-start">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
                {membersTable.map((member, i) => (
                  <tr key={i} className={`transition-colors ${isDarkMode ? 'hover:bg-[#0a0a1a]/50' : 'hover:bg-gray-50/50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? 'border-gray-800' : 'border-white'} ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.role}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.email}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.phone}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.experience}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{member.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${member.status === 'Active' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-500') : (isDarkMode ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-500')}`}>
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
    </div>
  );
}
