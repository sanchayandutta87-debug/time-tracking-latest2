import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, ShieldAlert, 
  AlertTriangle, Info, Filter, ChevronDown, Eye, 
  CheckCircle2, XCircle, MoreVertical, Download, Printer
} from 'lucide-react';

interface UnusualActivityRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  activity: string;
  totalTime: string;
  percentage: number;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
}

const initialData: UnusualActivityRecord[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    activity: 'Typing continuously at a speed far above the average for the user\'s role or task.',
    totalTime: '30m',
    percentage: 50,
    severity: 'High',
    timestamp: '2026-04-09 08:45 AM'
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'online',
    activity: 'mouse moving in an unusual pattern for extended periods without any clicks.',
    totalTime: '30m',
    percentage: 50,
    severity: 'High',
    timestamp: '2026-04-09 09:12 AM'
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'online',
    activity: 'Mouse and keyboard actions occurring in a synchronized, unnatural way.',
    totalTime: '30m',
    percentage: 50,
    severity: 'Medium',
    timestamp: '2026-04-09 10:05 AM'
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'online',
    activity: 'Long durations of a single key being held down.',
    totalTime: '30m',
    percentage: 50,
    severity: 'High',
    timestamp: '2026-04-09 10:30 AM'
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    activity: 'Continuous typing in software where such activity is uncommon.',
    totalTime: '30m',
    percentage: 50,
    severity: 'Low',
    timestamp: '2026-04-09 11:15 AM'
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'online',
    activity: 'Typing the same characters repeatedly',
    totalTime: '30m',
    percentage: 50,
    severity: 'Medium',
    timestamp: '2026-04-09 11:45 AM'
  },
  {
    id: 7,
    name: 'Leslie Hensley',
    avatar: 'https://picsum.photos/seed/leslie/40/40',
    status: 'online',
    activity: 'A high volume of backspaces or corrections in a short time span.',
    totalTime: '30m',
    percentage: 50,
    severity: 'High',
    timestamp: '2026-04-09 12:20 PM'
  },
  {
    id: 8,
    name: 'Karen Colven',
    avatar: 'https://picsum.photos/seed/colven/40/40',
    status: 'online',
    activity: 'Frequent double-clicks beyond typical usage',
    totalTime: '20m',
    percentage: 50,
    severity: 'Low',
    timestamp: '2026-04-09 01:10 PM'
  }
];

export default function UnusualActivityView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeverity, setActiveSeverity] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');

  const filteredData = initialData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.activity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = activeSeverity === 'All' || record.severity === activeSeverity;
    const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
    return matchesSearch && matchesSeverity && matchesEmployee;
  });

  const getSeverityColor = (severity: UnusualActivityRecord['severity']) => {
    switch (severity) {
      case 'High': return 'bg-red-50 text-red-600 border-red-100';
      case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Unusual Activity</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Unusual Activity</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Alerts</p>
            <h3 className="text-xl font-bold text-gray-800">{initialData.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">High Severity</p>
            <h3 className="text-xl font-bold text-gray-800">{initialData.filter(d => d.severity === 'High').length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Resolved Today</p>
            <h3 className="text-xl font-bold text-gray-800">14</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Response Time</p>
            <h3 className="text-xl font-bold text-gray-800">12m</h3>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
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
            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
              {['All', 'High', 'Medium', 'Low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setActiveSeverity(sev as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    activeSeverity === sev 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[160px]"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option>All Employees</option>
                {Array.from(new Set(initialData.map(d => d.name))).map(name => (
                  <option key={name}>{name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <input 
                type="date" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Unusual Activity</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total Time</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
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
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{record.name}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{record.timestamp}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                      {record.activity}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getSeverityColor(record.severity)}`}>
                      {record.severity}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{record.totalTime}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{record.percentage}%</span>
                      <div className="w-24 h-6 bg-gray-100 rounded-md overflow-hidden relative">
                        <div 
                          className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-500"
                          style={{ width: `${record.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Investigate">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Resolve">
                        <CheckCircle2 size={18} />
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

      {filteredData.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200 mt-6">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-bold">No unusual activity found</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
        <Info size={18} className="text-blue-600 mt-0.5" />
        <div>
          <h5 className="text-sm font-bold text-blue-900">About Unusual Activity Detection</h5>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            Our AI-driven detection system monitors patterns in typing speed, mouse movements, and application usage to identify potential anomalies. 
            High severity alerts should be investigated immediately as they may indicate automated scripts or security breaches.
          </p>
        </div>
      </div>
    </div>
  );
}
