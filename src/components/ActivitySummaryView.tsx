import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Download, 
  Clock, Filter, ChevronDown, BarChart3, TrendingUp, 
  MousePointer2, FileText, Printer, Info
} from 'lucide-react';

interface ActivityLog {
  start: string;
  end: string;
  type: 'high' | 'medium' | 'low' | 'idle';
}

interface EmployeeActivity {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  totalTime: string;
  utilization: string;
  logs: ActivityLog[];
}

const activityData: EmployeeActivity[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    totalTime: '08h 15m',
    utilization: '80%',
    logs: [
      { start: '08:00', end: '08:15', type: 'high' },
      { start: '08:15', end: '10:30', type: 'medium' },
      { start: '11:15', end: '14:30', type: 'high' },
      { start: '15:00', end: '17:30', type: 'high' },
    ]
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'offline',
    totalTime: '09h 20m',
    utilization: '92%',
    logs: [
      { start: '09:00', end: '12:00', type: 'high' },
      { start: '12:30', end: '15:00', type: 'high' },
      { start: '15:30', end: '18:00', type: 'medium' },
      { start: '19:00', end: '21:00', type: 'high' },
    ]
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'online',
    totalTime: '08h 00m',
    utilization: '75%',
    logs: [
      { start: '09:30', end: '11:30', type: 'medium' },
      { start: '12:00', end: '14:00', type: 'high' },
      { start: '14:30', end: '16:00', type: 'low' },
      { start: '16:30', end: '19:30', type: 'high' },
    ]
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'offline',
    totalTime: '08h 25m',
    utilization: '88%',
    logs: [
      { start: '09:45', end: '13:00', type: 'high' },
      { start: '13:30', end: '15:30', type: 'medium' },
      { start: '16:00', end: '18:00', type: 'high' },
      { start: '18:30', end: '20:30', type: 'high' },
    ]
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    totalTime: '08h 15m',
    utilization: '82%',
    logs: [
      { start: '09:00', end: '11:00', type: 'high' },
      { start: '11:30', end: '13:30', type: 'medium' },
      { start: '14:00', end: '16:00', type: 'high' },
      { start: '16:30', end: '18:30', type: 'high' },
    ]
  }
];

const timeLabels = [
  '06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'
];

export default function ActivitySummaryView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = activityData.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPosition = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    let totalMinutes = h * 60 + m;
    totalMinutes -= 6 * 60; // Start at 06:00
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    return (totalMinutes / (16 * 60)) * 100; // Show 16 hours (06:00 to 22:00)
  };

  const getWidth = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    return ((endMinutes - startMinutes) / (16 * 60)) * 100;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Activity Summary</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Activity Summary</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Avg Utilization</p>
            <h3 className="text-xl font-bold text-gray-800">82.4%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Active Time</p>
            <h3 className="text-xl font-bold text-gray-800">42h 15m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <MousePointer2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Clicks</p>
            <h3 className="text-xl font-bold text-gray-800">12,450</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Reports Generated</p>
            <h3 className="text-xl font-bold text-gray-800">24</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'day' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Day
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'week' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Week
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('month')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'month' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Calendar size={16} />
          By Month
          {activeTab === 'month' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
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
            <select className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10">
              <option>All Employees</option>
              {activityData.map(emp => <option key={emp.id}>{emp.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="date" 
              className="w-full lg:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors" title="Export PDF">
              <FileText size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Total Time (H)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Utilization</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
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
                      <h4 className="text-sm font-bold text-gray-900">{record.name}</h4>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{record.totalTime}</td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{record.utilization}</td>
                  <td className="p-4">
                    <div className="relative pt-2 pb-8">
                      <div className="h-8 bg-gray-100 rounded-md overflow-hidden relative">
                        {record.logs.map((log, i) => (
                          <div 
                            key={i}
                            className={`absolute top-0 bottom-0 transition-all hover:brightness-90 cursor-help group/bar ${
                              log.type === 'high' ? 'bg-emerald-500' : 
                              log.type === 'medium' ? 'bg-orange-400' : 
                              log.type === 'low' ? 'bg-blue-400' : 'bg-gray-300'
                            }`}
                            style={{
                              left: `${getPosition(log.start)}%`,
                              width: `${getWidth(log.start, log.end)}%`
                            }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-20">
                              {log.start} - {log.end} ({log.type} activity)
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Time Labels */}
                      <div className="absolute bottom-0 left-0 w-full flex justify-between px-[2%]">
                        {timeLabels.map((label, i) => (
                          <span key={i} className="text-[10px] text-gray-400 font-medium">{label}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Info */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase">High Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase">Medium Activity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase">Low Activity</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Utilization is calculated based on active keyboard and mouse movements during tracked hours.</p>
        </div>
      </div>
    </div>
  );
}
