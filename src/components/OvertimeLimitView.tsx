import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  Clock, Filter, ChevronDown, Download, 
  Printer, Info, AlertTriangle, BarChart3,
  TrendingUp, ExternalLink, MoreVertical,
  ChevronUp, User, ShieldAlert
} from 'lucide-react';

interface OvertimeSession {
  id: string;
  date: string;
  regularHours: string;
  overtimeHours: string;
  project: string;
}

interface OvertimeRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  totalOvertime: string;
  sessions: OvertimeSession[];
  severity: 'high' | 'medium' | 'low';
}

const initialData: OvertimeRecord[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    totalOvertime: '05h 45m',
    severity: 'medium',
    sessions: [
      { id: 'o1', date: '08 Apr 2026', regularHours: '08h 00m', overtimeHours: '02h 15m', project: 'Office Management' },
      { id: 'o2', date: '09 Apr 2026', regularHours: '08h 00m', overtimeHours: '03h 30m', project: 'Office Management' }
    ]
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'online',
    totalOvertime: '09h 20m',
    severity: 'high',
    sessions: [
      { id: 'o3', date: '07 Apr 2026', regularHours: '08h 00m', overtimeHours: '04h 20m', project: 'Travel Planning' },
      { id: 'o4', date: '08 Apr 2026', regularHours: '08h 00m', overtimeHours: '05h 00m', project: 'Travel Planning' }
    ]
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'offline',
    totalOvertime: '08h 00m',
    severity: 'high',
    sessions: []
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'online',
    totalOvertime: '08h 25m',
    severity: 'high',
    sessions: []
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    totalOvertime: '08h 15m',
    severity: 'high',
    sessions: []
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'online',
    totalOvertime: '08h 30m',
    severity: 'high',
    sessions: []
  },
  {
    id: 7,
    name: 'Leslie Hensley',
    avatar: 'https://picsum.photos/seed/leslie/40/40',
    status: 'online',
    totalOvertime: '09h 30m',
    severity: 'high',
    sessions: []
  }
];

export default function OvertimeLimitView() {
  const [activeTab, setActiveTab] = useState<'employee' | 'date' | 'team'>('employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

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

  const getSeverityStyles = (severity: OvertimeRecord['severity']) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Overtime Limit</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Overtime Limit</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Overtime</p>
            <h3 className="text-xl font-bold text-gray-800">124h 30m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Limit Exceeded</p>
            <h3 className="text-xl font-bold text-gray-800">12 Users</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg. Overtime</p>
            <h3 className="text-xl font-bold text-gray-800">08h 15m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cost Impact</p>
            <h3 className="text-xl font-bold text-gray-800">$4,250</h3>
          </div>
        </div>
      </div>

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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Overlimit Time</th>
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
                          {expandedRows.includes(record.id) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityStyles(record.severity)}`}>
                          {record.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-bold text-gray-700">{record.totalOvertime}</span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandedRows.includes(record.id) && (
                    <tr>
                      <td colSpan={2} className="p-0 bg-gray-50/30">
                        <div className="p-6 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overtime Sessions Breakdown</h5>
                            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View Timesheet</button>
                          </div>
                          
                          {record.sessions.length > 0 ? (
                            <div className="space-y-3">
                              {record.sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                                      <Clock size={16} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">{session.date}</p>
                                      <p className="text-[10px] text-gray-400 font-medium">Project: {session.project}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-6">
                                    <div className="text-right">
                                      <p className="text-[10px] text-gray-400 uppercase font-bold">Regular</p>
                                      <p className="text-xs font-bold text-gray-600">{session.regularHours}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[10px] text-red-400 uppercase font-bold">Overtime</p>
                                      <p className="text-xs font-bold text-red-600">{session.overtimeHours}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400 italic">No detailed overtime data available for this period.</p>
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
          <p className="text-xs italic">Overtime is calculated based on hours worked beyond the standard 8-hour daily limit or 40-hour weekly limit.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold text-blue-600 hover:underline">Policy Settings</button>
          <button className="text-xs font-bold text-blue-600 hover:underline">Approval Workflow</button>
        </div>
      </div>
    </div>
  );
}
