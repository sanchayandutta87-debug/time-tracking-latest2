import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Globe, Box, 
  Clock, Filter, ChevronDown, Download, Printer,
  BarChart3, ShieldCheck, ShieldAlert, Shield,
  ExternalLink, MoreVertical, Layout, Info
} from 'lucide-react';

interface UsageEntry {
  id: number;
  name: string;
  type: 'web' | 'app';
  duration: string;
  seconds: number;
  category: 'productive' | 'unproductive' | 'neutral';
}

const usageData: UsageEntry[] = [
  { id: 1, name: 'New tab - Google Chrome', type: 'web', duration: '00h 02m 00s', seconds: 120, category: 'neutral' },
  { id: 2, name: 'figma.com - Google Chrome', type: 'web', duration: '00h 20m 15s', seconds: 1215, category: 'productive' },
  { id: 3, name: 'figma', type: 'app', duration: '03h 10m 30s', seconds: 11430, category: 'productive' },
  { id: 4, name: 'accounts.google.com - Google Chrome', type: 'web', duration: '00h 04m 15s', seconds: 255, category: 'neutral' },
  { id: 5, name: 'mail.google.com - Google Chrome', type: 'web', duration: '00h 04m 10s', seconds: 250, category: 'productive' },
  { id: 6, name: 'Visual Code', type: 'app', duration: '01h 55m 20s', seconds: 6920, category: 'productive' },
  { id: 7, name: 'meet.google.com - Google Chrome', type: 'web', duration: '00h 15m 10s', seconds: 910, category: 'productive' },
  { id: 8, name: 'File Manager', type: 'app', duration: '00h 02m 00s', seconds: 120, category: 'neutral' },
  { id: 9, name: 'chatgpt.com - Google Chrome', type: 'web', duration: '00h 10m 05s', seconds: 605, category: 'productive' },
  { id: 10, name: 'dribbble.com - Google Chrome', type: 'web', duration: '00h 02m 10s', seconds: 130, category: 'productive' },
  { id: 11, name: 'Snipping Tool', type: 'app', duration: '00h 02m 50s', seconds: 170, category: 'neutral' },
  { id: 12, name: 'behance.net - Google Chrome', type: 'web', duration: '00h 08m 30s', seconds: 510, category: 'productive' },
  { id: 13, name: 'github.com - Google Chrome', type: 'web', duration: '00h 03m 40s', seconds: 220, category: 'productive' },
  { id: 14, name: 'Notepad', type: 'app', duration: '00h 05m 45s', seconds: 345, category: 'neutral' },
  { id: 15, name: 'youtube.com - Google Chrome', type: 'web', duration: '00h 07m 20s', seconds: 440, category: 'unproductive' },
];

export default function WebAppUsageView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('James Higham');
  const [filterCategory, setFilterCategory] = useState<'all' | 'productive' | 'unproductive' | 'neutral'>('all');

  const filteredData = usageData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || record.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const maxSeconds = Math.max(...usageData.map(d => d.seconds));

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Web & App Usage</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Web & App Usage</span>
        </div>
      </div>

      {/* Top Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
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

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <select 
              className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option>All Employees</option>
              <option>James Higham</option>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Layout size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Work Time</p>
              <h3 className="text-xl font-bold text-gray-800">09h 20m</h3>
            </div>
          </div>
          <p className="text-xs text-gray-400 font-medium">All Websites & Apps</p>
        </div>

        <div 
          onClick={() => setFilterCategory(filterCategory === 'productive' ? 'all' : 'productive')}
          className={`bg-white p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filterCategory === 'productive' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productive Time</p>
              <h3 className="text-xl font-bold text-gray-800">08h 40m</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[94%]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400">94%</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterCategory(filterCategory === 'unproductive' ? 'all' : 'unproductive')}
          className={`bg-white p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filterCategory === 'unproductive' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unproductive Time</p>
              <h3 className="text-xl font-bold text-gray-800">00h 30m</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 w-[4%]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400">04%</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterCategory(filterCategory === 'neutral' ? 'all' : 'neutral')}
          className={`bg-white p-6 rounded-xl border shadow-sm cursor-pointer transition-all ${filterCategory === 'neutral' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100'}`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Neutral Time</p>
              <h3 className="text-xl font-bold text-gray-800">00h 10m</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[2%]" />
            </div>
            <span className="text-[10px] font-bold text-gray-400">02%</span>
          </div>
        </div>
      </div>

      {/* Employee Detail Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">Employee Name :</span>
          <span className="text-sm font-bold text-gray-800">{selectedEmployee}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">Total Time Worked :</span>
          <span className="text-sm font-bold text-gray-800">09h 20m</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-96">Websites & Apps</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Total Time (H)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Bar</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${record.type === 'web' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {record.type === 'web' ? <Globe size={16} /> : <Box size={16} />}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{record.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-medium">{record.duration}</td>
                  <td className="p-4">
                    <div className="w-full h-6 bg-gray-50 rounded-md overflow-hidden relative group/bar">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                          record.category === 'productive' ? 'bg-emerald-500' : 
                          record.category === 'unproductive' ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${(record.seconds / maxSeconds) * 100}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                        {record.duration}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="View Details">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Productive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unproductive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-400 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Neutral</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Usage data is categorized based on administrative rules and updated every 10 minutes.</p>
        </div>
      </div>
    </div>
  );
}
