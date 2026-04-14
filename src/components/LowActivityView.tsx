import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  AlertCircle, TrendingDown, Clock, Download, 
  Printer, Filter, ChevronDown, Info, ArrowDownRight,
  UserX, MousePointer2, BarChart3
} from 'lucide-react';

interface LowActivityRecord {
  id: number;
  name: string;
  avatar: string;
  percentage: number;
  status: 'online' | 'offline';
  lastActive: string;
  totalTime: string;
}

const initialData: LowActivityRecord[] = [
  { id: 1, name: 'Kevin Borger', avatar: 'https://picsum.photos/seed/kevin/40/40', percentage: 2.32, status: 'online', lastActive: '2m ago', totalTime: '08h 15m' },
  { id: 2, name: 'Jada Robinson', avatar: 'https://picsum.photos/seed/jada/40/40', percentage: 13.30, status: 'online', lastActive: '5m ago', totalTime: '07h 45m' },
  { id: 3, name: 'Frances Chapman', avatar: 'https://picsum.photos/seed/frances/40/40', percentage: 11.20, status: 'offline', lastActive: '1h ago', totalTime: '06h 30m' },
  { id: 4, name: 'Leslie Hensley', avatar: 'https://picsum.photos/seed/leslie/40/40', percentage: 19.04, status: 'online', lastActive: 'Just now', totalTime: '08h 00m' },
  { id: 5, name: 'Shaun Farley', avatar: 'https://picsum.photos/seed/shaun/40/40', percentage: 24.16, status: 'online', lastActive: '12m ago', totalTime: '09h 10m' },
  { id: 6, name: 'Jenny Ellis', avatar: 'https://picsum.photos/seed/jenny/40/40', percentage: 10.12, status: 'online', lastActive: '8m ago', totalTime: '08h 30m' },
  { id: 7, name: 'Leon Baxter', avatar: 'https://picsum.photos/seed/leon/40/40', percentage: 32.82, status: 'online', lastActive: '4m ago', totalTime: '07h 55m' },
  { id: 8, name: 'Karen Flores', avatar: 'https://picsum.photos/seed/karen/40/40', percentage: 8.53, status: 'offline', lastActive: '3h ago', totalTime: '05h 20m' },
  { id: 9, name: 'Charles Cline', avatar: 'https://picsum.photos/seed/charles/40/40', percentage: 4.04, status: 'online', lastActive: '15m ago', totalTime: '08h 45m' },
  { id: 10, name: 'Karen Galvan', avatar: 'https://picsum.photos/seed/galvan/40/40', percentage: 20.42, status: 'online', lastActive: '1m ago', totalTime: '08h 20m' },
  { id: 11, name: 'Thomas Ward', avatar: 'https://picsum.photos/seed/thomas/40/40', percentage: 23.61, status: 'online', lastActive: '6m ago', totalTime: '07h 30m' },
  { id: 12, name: 'Aliza Duncan', avatar: 'https://picsum.photos/seed/aliza/40/40', percentage: 17.80, status: 'online', lastActive: 'Just now', totalTime: '09h 00m' },
];

export default function LowActivityView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'percentage'>('percentage');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');

  const filteredData = initialData
    .filter(record => {
      const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
      return matchesSearch && matchesEmployee;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.percentage - b.percentage;
    });

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Low Activity</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Low Activity</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Low Activity Users</p>
            <h3 className="text-xl font-bold text-gray-800">{initialData.filter(d => d.percentage < 10).length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg. Activity</p>
            <h3 className="text-xl font-bold text-gray-800">15.6%</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <MousePointer2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Idle Time</p>
            <h3 className="text-xl font-bold text-gray-800">14h 20m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alerts Sent</p>
            <h3 className="text-xl font-bold text-gray-800">8</h3>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
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
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setSortBy('percentage')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  sortBy === 'percentage' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                By Activity
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  sortBy === 'name' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                By Name
              </button>
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[160px]"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option>All Employees</option>
                {initialData.map(d => <option key={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <input 
                type="date" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="dd/mm/yyyy"
              />
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((record) => (
          <div key={record.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={record.avatar} 
                    alt={record.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${record.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{record.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Last active: {record.lastActive}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-red-500">{record.percentage.toFixed(2)} %</span>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{record.totalTime}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-gray-50 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-1000 ease-out"
                style={{ width: `${record.percentage}%` }}
              />
            </div>
            
            {/* Hover Actions */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View Timeline</button>
              <button className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-500">Send Alert</button>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 mt-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold">No low activity users found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <Info size={18} className="text-blue-600 mt-0.5" />
        <div>
          <h5 className="text-sm font-bold text-blue-900">About Low Activity Tracking</h5>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Low activity is calculated based on the ratio of active keyboard/mouse input versus the total time tracked. 
            Users with less than 10% activity are flagged for review. This report helps identify potential bottlenecks or engagement issues.
          </p>
        </div>
      </div>
    </div>
  );
}
