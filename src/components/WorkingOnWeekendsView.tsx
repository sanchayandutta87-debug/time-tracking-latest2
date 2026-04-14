import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  Clock, Filter, ChevronDown, Download, 
  Printer, Info, BarChart3, TrendingUp,
  ExternalLink, MoreVertical, ChevronUp, 
  User, Coffee, Briefcase, CheckCircle2,
  AlertCircle, ShieldCheck
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface WeekendSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  project: string;
  status: 'approved' | 'pending' | 'flagged';
}

interface WeekendWorkRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  totalTime: string;
  sessions: WeekendSession[];
  compliance: 'compliant' | 'warning';
}

const projectData = [
  { name: 'Office Mgmt', hours: 12, color: '#3b82f6' },
  { name: 'Travel Plan', hours: 18, color: '#10b981' },
  { name: 'Admin Tasks', hours: 8, color: '#f59e0b' },
  { name: 'Client Support', hours: 15, color: '#8b5cf6' },
  { name: 'Other', hours: 5, color: '#94a3b8' },
];

const initialData: WeekendWorkRecord[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    totalTime: '05h 45m',
    compliance: 'compliant',
    sessions: [
      { id: 'w1', date: 'Sat, 04 Apr 2026', startTime: '10:00 AM', endTime: '01:00 PM', duration: '03h 00m', project: 'Office Management', status: 'approved' },
      { id: 'w2', date: 'Sun, 05 Apr 2026', startTime: '02:00 PM', endTime: '04:45 PM', duration: '02h 45m', project: 'Office Management', status: 'approved' }
    ]
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'online',
    totalTime: '09h 20m',
    compliance: 'warning',
    sessions: [
      { id: 'w3', date: 'Sat, 04 Apr 2026', startTime: '09:00 AM', endTime: '02:00 PM', duration: '05h 00m', project: 'Travel Planning', status: 'approved' },
      { id: 'w4', date: 'Sun, 05 Apr 2026', startTime: '11:00 AM', endTime: '03:20 PM', duration: '04h 20m', project: 'Travel Planning', status: 'pending' }
    ]
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'offline',
    totalTime: '08h 00m',
    compliance: 'compliant',
    sessions: [
      { id: 'w5', date: 'Sat, 04 Apr 2026', startTime: '10:00 AM', endTime: '06:00 PM', duration: '08h 00m', project: 'Admin Tasks', status: 'flagged' }
    ]
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'online',
    totalTime: '08h 25m',
    compliance: 'compliant',
    sessions: []
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    totalTime: '08h 15m',
    compliance: 'compliant',
    sessions: []
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'online',
    totalTime: '08h 30m',
    compliance: 'compliant',
    sessions: []
  },
  {
    id: 7,
    name: 'Leslie Hensley',
    avatar: 'https://picsum.photos/seed/leslie/40/40',
    status: 'online',
    totalTime: '09h 30m',
    compliance: 'warning',
    sessions: []
  }
];

export default function WorkingOnWeekendsView() {
  const [activeTab, setActiveTab] = useState<'employee' | 'date' | 'team'>('employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [showInsights, setShowInsights] = useState(true);

  const weekendDays = [
    { day: 'Sat', dates: ['04 Apr', '11 Apr', '18 Apr', '25 Apr'] },
    { day: 'Sun', dates: ['05 Apr', '12 Apr', '19 Apr', '26 Apr'] }
  ];

  const toggleRow = (id: number) => {
    setExpandedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const filteredData = initialData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  const getStatusBadge = (status: WeekendSession['status']) => {
    switch (status) {
      case 'approved': return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><CheckCircle2 size={10} /> APPROVED</span>;
      case 'pending': return <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><Clock size={10} /> PENDING</span>;
      case 'flagged': return <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100"><AlertCircle size={10} /> FLAGGED</span>;
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Working on Weekends</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Working on Weekends</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Weekend Hours</p>
            <h3 className="text-xl font-bold text-gray-800">58h 15m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Employees</p>
            <h3 className="text-xl font-bold text-gray-800">14</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productivity Rate</p>
            <h3 className="text-xl font-bold text-gray-800">88%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Impact</p>
            <h3 className="text-xl font-bold text-gray-800">12 Projects</h3>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {showInsights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                Weekend Project Distribution
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Heatmap:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${i === 1 ? 'bg-blue-50' : i === 2 ? 'bg-blue-100' : i === 3 ? 'bg-blue-300' : i === 4 ? 'bg-blue-500' : 'bg-blue-700'}`} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                      width={80}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={12}>
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Weekend Activity Heatmap</h4>
                <div className="space-y-3">
                  {weekendDays.map((row) => (
                    <div key={row.day} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-500 w-6">{row.day}</span>
                      <div className="flex gap-2">
                        {row.dates.map((date, idx) => {
                          const intensity = Math.floor(Math.random() * 5);
                          const colors = ['bg-gray-50', 'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700'];
                          return (
                            <div 
                              key={date} 
                              className={`w-8 h-8 rounded-lg ${colors[intensity]} flex flex-col items-center justify-center cursor-help group relative transition-transform hover:scale-110`}
                            >
                              <span className={`text-[8px] font-bold ${intensity > 2 ? 'text-white' : 'text-gray-400'}`}>{date.split(' ')[0]}</span>
                              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                <div className="bg-gray-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl">
                                  {date}: {intensity * 4}h tracked
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Policy Compliance
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Approved Hours</span>
                <span className="text-xs font-bold text-emerald-600">42h 30m</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[72%]" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Pending Review</span>
                <span className="text-xs font-bold text-amber-600">12h 45m</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[22%]" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Flagged/Excessive</span>
                <span className="text-xs font-bold text-red-600">03h 00m</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[6%]" />
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  * Policy flags are triggered when weekend work exceeds 10 hours per user or occurs without prior manager approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('employee')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'employee' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <User size={16} />
          By Employee
          {activeTab === 'employee' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('date')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'date' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Date
          {activeTab === 'date' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('team')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'team' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Users size={16} />
          By Team
          {activeTab === 'team' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Keyword" 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[180px]"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option>All Employees</option>
                {initialData.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium flex items-center gap-2 text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>10 Apr 26 - 10 Apr 26</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm" title="Print">
                <Printer size={18} />
              </button>
              <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm" title="Export PDF">
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <React.Fragment key={record.id}>
                  <tr 
                    onClick={() => toggleRow(record.id)}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer group ${expandedRows.includes(record.id) ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={record.avatar} 
                            alt={record.name} 
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-gray-900">{record.name}</h4>
                          {record.compliance === 'warning' && <AlertCircle size={14} className="text-red-500" />}
                          {expandedRows.includes(record.id) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-bold text-gray-700">{record.totalTime}</span>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandedRows.includes(record.id) && (
                    <tr>
                      <td colSpan={2} className="p-0 bg-gray-50/30">
                        <div className="p-6 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weekend Sessions Breakdown</h5>
                            <div className="flex items-center gap-3">
                              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">Approve All</button>
                              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View Details</button>
                            </div>
                          </div>
                          
                          {record.sessions.length > 0 ? (
                            <div className="space-y-3">
                              {record.sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                      <Clock size={16} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">{session.date}</p>
                                      <p className="text-[10px] text-gray-400 font-medium">{session.startTime} - {session.endTime}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-8">
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">Project</p>
                                      <p className="text-xs font-bold text-gray-600">{session.project}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] text-blue-400 uppercase font-bold">Duration</p>
                                      <p className="text-xs font-bold text-blue-600">{session.duration}</p>
                                    </div>
                                    <div className="w-24 flex justify-end">
                                      {getStatusBadge(session.status)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400 italic">No detailed weekend work data available for this period.</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Weekend work is tracked for any activity recorded on Saturdays and Sundays. Special compensation rates may apply.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold text-blue-600 hover:underline">Weekend Policy</button>
          <button className="text-xs font-bold text-blue-600 hover:underline">Compensation Rules</button>
        </div>
      </div>
    </div>
  );
}
