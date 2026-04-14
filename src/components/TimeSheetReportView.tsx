import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Download, 
  Clock, Info, Filter, FileText, ChevronDown, Activity
} from 'lucide-react';

interface TimeLog {
  start: string; // e.g., "06:00"
  end: string;   // e.g., "08:00"
  type: 'active' | 'break' | 'overtime';
}

interface EmployeeTime {
  id: number;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
  totalTime: string;
  logs: TimeLog[];
}

const employees: EmployeeTime[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    totalTime: '08h 15m',
    logs: [
      { start: '10:00', end: '12:00', type: 'active' },
      { start: '12:00', end: '12:15', type: 'break' },
      { start: '12:15', end: '14:00', type: 'active' },
      { start: '14:00', end: '14:30', type: 'active' },
      { start: '14:45', end: '15:15', type: 'active' },
      { start: '15:30', end: '17:30', type: 'active' },
      { start: '18:00', end: '22:00', type: 'active' },
    ]
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'offline',
    totalTime: '09h 20m',
    logs: [
      { start: '10:00', end: '11:30', type: 'active' },
      { start: '11:45', end: '14:00', type: 'active' },
      { start: '14:15', end: '16:30', type: 'active' },
      { start: '16:45', end: '18:30', type: 'active' },
      { start: '19:00', end: '23:00', type: 'active' },
    ]
  },
  {
    id: 3,
    name: 'Leon Baxter',
    role: 'Senior Manager',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'online',
    totalTime: '08h 00m',
    logs: [
      { start: '09:30', end: '11:30', type: 'active' },
      { start: '11:45', end: '13:30', type: 'active' },
      { start: '13:45', end: '15:00', type: 'active' },
      { start: '15:00', end: '15:30', type: 'break' },
      { start: '15:30', end: '21:30', type: 'active' },
    ]
  },
  {
    id: 4,
    name: 'Karen Flores',
    role: 'SEO Analyst',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'offline',
    totalTime: '08h 25m',
    logs: [
      { start: '09:45', end: '12:00', type: 'active' },
      { start: '12:00', end: '12:30', type: 'overtime' },
      { start: '12:30', end: '13:00', type: 'break' },
      { start: '13:00', end: '15:00', type: 'active' },
      { start: '15:15', end: '17:30', type: 'active' },
      { start: '17:45', end: '22:30', type: 'active' },
    ]
  },
  {
    id: 5,
    name: 'Charles Cline',
    role: 'HR Assistant',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    totalTime: '08h 15m',
    logs: [
      { start: '09:45', end: '11:45', type: 'active' },
      { start: '12:00', end: '13:00', type: 'active' },
      { start: '13:15', end: '14:30', type: 'active' },
      { start: '14:45', end: '18:30', type: 'active' },
      { start: '19:00', end: '21:00', type: 'active' },
      { start: '21:15', end: '23:00', type: 'active' },
    ]
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    role: 'Application Designer',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'offline',
    totalTime: '08h 30m',
    logs: [
      { start: '11:00', end: '12:00', type: 'active' },
      { start: '12:15', end: '12:45', type: 'active' },
      { start: '12:45', end: '13:15', type: 'break' },
      { start: '13:15', end: '15:00', type: 'active' },
      { start: '15:15', end: '17:30', type: 'active' },
      { start: '17:45', end: '23:30', type: 'active' },
    ]
  }
];

const hours = [
  '06 AM', '08 AM', '10 AM', '12 PM', '02 PM', '04 PM', 
  '06 PM', '08 PM', '10 PM', '12 AM', '02 AM', '04 AM'
];

export default function TimeSheetReportView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to calculate position and width based on time
  // Timeline starts at 06:00 and ends at 06:00 next day (24 hours)
  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    let totalMinutes = h * 60 + m;
    // Adjust for 06:00 start
    totalMinutes -= 6 * 60;
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getWidth = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    
    return ((endMinutes - startMinutes) / (24 * 60)) * 100;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Time Sheet Report</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Time Sheet Report</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Hours</p>
              <h3 className="text-xl font-bold text-gray-800">52h 45m</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Active Employees</p>
              <h3 className="text-xl font-bold text-gray-800">12 / 15</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Avg Productivity</p>
              <h3 className="text-xl font-bold text-gray-800">84%</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase">Export Report</p>
              <button className="text-sm font-bold text-blue-600 hover:underline">Download PDF</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'day' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Clock size={16} />
            Time Sheet Report Day
          </div>
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'week' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            Time Sheet Report Week
          </div>
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select 
              className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option>All Employees</option>
              <option>Shaun Farley</option>
              <option>Jenny Ellis</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="date" 
              className="w-full lg:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Total Time (H)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex justify-between">
                    {hours.map((hour, i) => (
                      <span key={i} className="text-[10px]">{hour}</span>
                    ))}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={emp.avatar} 
                          alt={emp.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${emp.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{emp.name}</h4>
                        <p className="text-xs text-gray-400">{emp.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-600">{emp.totalTime}</span>
                  </td>
                  <td className="p-4">
                    <div className="relative h-8 bg-gray-100 rounded-md overflow-hidden group/timeline">
                      {/* Timeline Grid Lines */}
                      <div className="absolute inset-0 flex justify-between px-[2%]">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div key={i} className="h-full w-[1px] bg-white/50" />
                        ))}
                      </div>

                      {/* Time Bars */}
                      {emp.logs.map((log, i) => (
                        <div 
                          key={i}
                          className={`absolute top-1 bottom-1 rounded-sm transition-all hover:brightness-90 cursor-help group/bar ${
                            log.type === 'active' ? 'bg-emerald-500' : 
                            log.type === 'break' ? 'bg-orange-400' : 'bg-blue-500'
                          }`}
                          style={{
                            left: `${getPosition(log.start)}%`,
                            width: `${getWidth(log.start, log.end)}%`
                          }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-20">
                            {log.start} - {log.end} ({log.type})
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
          <span className="text-xs font-medium text-gray-500">Active Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-400 rounded-sm" />
          <span className="text-xs font-medium text-gray-500">Break</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
          <span className="text-xs font-medium text-gray-500">Overtime / Special</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Info size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400 italic">Timeline shows 24-hour activity starting from 06:00 AM</span>
        </div>
      </div>
    </div>
  );
}
