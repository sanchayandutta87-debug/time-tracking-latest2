import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Clock, 
  CheckCircle2, XCircle, AlertCircle, Filter, 
  ChevronDown, MoreVertical, Download, Printer,
  Briefcase, FileText, Info, Eye
} from 'lucide-react';

interface ManualTimeEntry {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  editTime: string;
  duration: string;
  project: string;
  task: string;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  reason: string;
  timestamp: string;
}

const manualTimeData: ManualTimeEntry[] = [
  {
    id: 1,
    name: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '00h 45m',
    project: 'Office Management',
    task: 'Components Creation',
    approvalStatus: 'Approved',
    reason: 'Internal meeting',
    timestamp: '2026-04-09 09:30 AM'
  },
  {
    id: 2,
    name: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '00h 30m',
    project: 'Travel Planning Website',
    task: 'Components Creation',
    approvalStatus: 'Pending',
    reason: 'Project Not Added',
    timestamp: '2026-04-09 10:15 AM'
  },
  {
    id: 3,
    name: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '01h 35m',
    project: 'Clinic Management',
    task: 'Components Creation',
    approvalStatus: 'Rejected',
    reason: 'Meeting With Client',
    timestamp: '2026-04-09 11:00 AM'
  },
  {
    id: 4,
    name: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '00h 45m',
    project: 'Chat & Call Mobile App',
    task: 'Components Creation',
    approvalStatus: 'Approved',
    reason: 'Meeting With Manager',
    timestamp: '2026-04-09 11:45 AM'
  },
  {
    id: 5,
    name: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '00h 30m',
    project: 'Chat & Call Mobile App',
    task: 'Components Creation',
    approvalStatus: 'Rejected',
    reason: 'Meeting With Client',
    timestamp: '2026-04-09 12:30 PM'
  },
  {
    id: 6,
    name: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40',
    status: 'online',
    editTime: '12:00 PM - 01:00PM',
    duration: '00h 45m',
    project: 'POS Admin Software',
    task: 'Components Creation',
    approvalStatus: 'Pending',
    reason: 'System Downtime',
    timestamp: '2026-04-09 01:15 PM'
  }
];

export default function ManualTimeReportView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');

  const filteredData = manualTimeData.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployee = selectedEmployee === 'All Employees' || record.name === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  const getStatusStyles = (status: ManualTimeEntry['approvalStatus']) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500 text-white';
      case 'Pending': return 'bg-orange-400 text-white';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manual Time</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Manual Time</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Manual Hours</p>
            <h3 className="text-xl font-bold text-gray-800">12h 45m</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Approved</p>
            <h3 className="text-xl font-bold text-gray-800">24</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-xl font-bold text-gray-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rejected</p>
            <h3 className="text-xl font-bold text-gray-800">8</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('day')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'day' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Clock size={16} />
          Manual Time Report Day
          {activeTab === 'day' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
        </button>
        <button 
          onClick={() => setActiveTab('week')}
          className={`pb-4 text-sm font-bold transition-all relative flex items-center gap-2 ${activeTab === 'week' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Clock size={16} />
          Manual Time Report Week
          {activeTab === 'week' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
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
                {Array.from(new Set(manualTimeData.map(d => d.name))).map(name => (
                  <option key={name}>{name}</option>
                ))}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Edit Time (H)</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Duration</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Project</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
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
                  <td className="p-4 text-sm text-gray-500 font-medium">{record.editTime}</td>
                  <td className="p-4 text-sm text-gray-500 font-medium">{record.duration}</td>
                  <td className="p-4">
                    <div>
                      <h5 className="text-sm font-bold text-gray-800">{record.project}</h5>
                      <p className="text-xs text-gray-400">{record.task}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyles(record.approvalStatus)}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        {record.approvalStatus}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{record.reason}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                        <CheckCircle2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                        <XCircle size={18} />
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

      {/* Info Box */}
      <div className="mt-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rejected</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Info size={14} />
          <p className="text-xs italic">Manual time entries require administrative approval to be included in payroll and productivity reports.</p>
        </div>
      </div>
    </div>
  );
}
