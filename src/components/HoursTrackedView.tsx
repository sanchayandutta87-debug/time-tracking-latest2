import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Clock, Download, 
  Printer, Filter, ChevronDown, BarChart3, TrendingUp,
  ArrowUpRight, ArrowDownRight, FileText, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

interface DailyTrackedHours {
  id: number;
  date: string;
  timeTracked: string;
  minutes: number;
  activePercentage: number;
  breakPercentage: number;
}

const mockData: DailyTrackedHours[] = [
  { id: 1, date: '01 Jan 2025', timeTracked: '08h 15m', minutes: 495, activePercentage: 80, breakPercentage: 20 },
  { id: 2, date: '02 Jan 2025', timeTracked: '07h 45m', minutes: 465, activePercentage: 85, breakPercentage: 15 },
  { id: 3, date: '03 Jan 2025', timeTracked: '09h 00m', minutes: 540, activePercentage: 75, breakPercentage: 25 },
  { id: 4, date: '04 Jan 2025', timeTracked: '08h 30m', minutes: 510, activePercentage: 90, breakPercentage: 10 },
  { id: 5, date: '05 Jan 2025', timeTracked: '08h 15m', minutes: 495, activePercentage: 82, breakPercentage: 18 },
  { id: 6, date: '06 Jan 2025', timeTracked: '07h 30m', minutes: 450, activePercentage: 70, breakPercentage: 30 },
  { id: 7, date: '07 Jan 2025', timeTracked: '08h 45m', minutes: 525, activePercentage: 88, breakPercentage: 12 },
];

const chartData = mockData.map(d => ({
  name: d.date.split(' ')[0] + ' ' + d.date.split(' ')[1],
  hours: parseFloat((d.minutes / 60).toFixed(2)),
}));

export default function HoursTrackedView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');

  const filteredData = mockData.filter(d => 
    d.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Hours Tracked</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Hours Tracked</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Clock size={20} />
            </div>
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
              <ArrowUpRight size={14} />
              +12.5%
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Hours</p>
          <h3 className="text-xl font-bold text-gray-800">1,240h</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
              <ArrowUpRight size={14} />
              +5.2%
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Daily Hours</p>
          <h3 className="text-xl font-bold text-gray-800">8h 15m</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <BarChart3 size={20} />
            </div>
            <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
              <ArrowDownRight size={14} />
              -2.1%
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productivity Rate</p>
          <h3 className="text-xl font-bold text-gray-800">88.4%</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
              <Download size={20} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Export Data</p>
          <div className="flex gap-2 mt-1">
            <button className="text-xs font-bold text-blue-600 hover:underline">PDF</button>
            <span className="text-gray-300">|</span>
            <button className="text-xs font-bold text-blue-600 hover:underline">Excel</button>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-gray-800">Hours Tracked Overview</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-[10px] font-medium text-gray-500">Tracked Hours</span>
            </div>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#3b82f6' : '#94a3b8'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
            <select 
              className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option>All Employees</option>
              <option>Shaun Farley</option>
              <option>Jenny Ellis</option>
              <option>Leon Baxter</option>
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
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm" title="Print">
              <Printer size={18} />
            </button>
            <button className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors shadow-sm" title="Export PDF">
              <FileText size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Time Tracked</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Activity Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <span className="text-sm font-bold text-gray-700">{record.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-600">{record.timeTracked}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden flex relative group/bar">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${record.activePercentage}%` }}
                        />
                        <div 
                          className="h-full bg-orange-400 transition-all duration-500"
                          style={{ width: `${record.breakPercentage}%` }}
                        />
                        
                        {/* Tooltip on bar */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-20">
                          Active: {record.activePercentage}% | Break: {record.breakPercentage}%
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-10">{record.activePercentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-medium text-gray-500">Active Work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
            <span className="text-xs font-medium text-gray-500">Break Time</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Data is updated every 15 minutes based on active tracking sessions.</p>
        </div>
      </div>
    </div>
  );
}
