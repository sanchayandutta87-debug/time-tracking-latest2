import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  Clock, Filter, ChevronDown, Download, 
  Printer, Info, MousePointer2, BarChart3,
  AlertCircle, ExternalLink, MoreVertical,
  ChevronUp, User
} from 'lucide-react';

interface IdleSession {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  reason?: string;
}

interface IdleTimeRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  totalIdleTime: string;
  sessions: IdleSession[];
}

const initialData: IdleTimeRecord[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    totalIdleTime: '05h 45m',
    sessions: [
      { id: 's1', startTime: '10:15 AM', endTime: '11:00 AM', duration: '45m', reason: 'Meeting' },
      { id: 's2', startTime: '01:30 PM', endTime: '03:00 PM', duration: '01h 30m', reason: 'Lunch' },
      { id: 's3', startTime: '04:15 PM', endTime: '05:00 PM', duration: '45m' }
    ]
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'online',
    totalIdleTime: '09h 20m',
    sessions: [
      { id: 's4', startTime: '09:00 AM', endTime: '12:00 PM', duration: '03h 00m' }
    ]
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'offline',
    totalIdleTime: '08h 00m',
    sessions: []
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'online',
    totalIdleTime: '08h 25m',
    sessions: []
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    totalIdleTime: '08h 15m',
    sessions: []
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'online',
    totalIdleTime: '08h 30m',
    sessions: []
  },
  {
    id: 7,
    name: 'Leslie Hensley',
    avatar: 'https://picsum.photos/seed/leslie/40/40',
    status: 'online',
    totalIdleTime: '09h 30m',
    sessions: []
  }
];

export default function IdleTimeReportView() {
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

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Idle Time</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Idle Time</span>
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
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Idle Time</th>
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
                      <span className="text-sm font-bold text-gray-700">{record.totalIdleTime}</span>
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  {expandedRows.includes(record.id) && (
                    <tr>
                      <td colSpan={2} className="p-0 bg-gray-50/30">
                        <div className="p-6 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Idle Sessions Breakdown</h5>
                            <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View Screenshots</button>
                          </div>
                          
                          {record.sessions.length > 0 ? (
                            <div className="space-y-3">
                              {record.sessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                      <Clock size={16} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">{session.startTime} - {session.endTime}</p>
                                      {session.reason && <p className="text-[10px] text-gray-400 font-medium">Reason: {session.reason}</p>}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                      {session.duration}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-gray-400 italic">No detailed session data available for this period.</p>
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

      {/* Summary Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <MousePointer2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Idle Time Today</p>
              <h3 className="text-xl font-bold text-gray-800">48h 15m</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400">Calculated across all active employees in the selected period.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg. Idle Time / User</p>
              <h3 className="text-xl font-bold text-gray-800">06h 53m</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400">Average idle duration per employee based on current filters.</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Idle time is recorded when there is no keyboard or mouse activity for more than 5 minutes.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-bold text-blue-600 hover:underline">Configure Thresholds</button>
          <button className="text-xs font-bold text-blue-600 hover:underline">Manage Reasons</button>
        </div>
      </div>
    </div>
  );
}
