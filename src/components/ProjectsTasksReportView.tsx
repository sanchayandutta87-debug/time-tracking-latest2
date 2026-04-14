import React, { useState } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, Briefcase, 
  Clock, Filter, ChevronDown, BarChart3, CheckCircle2, 
  FileText, Printer, MoreVertical, Layout
} from 'lucide-react';

interface TaskRecord {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  timeWorked: string;
  progress: number;
  tasks: { name: string; time: string; status: 'completed' | 'in-progress' }[];
}

interface ProjectData {
  projectName: string;
  totalTime: string;
  employees: TaskRecord[];
}

const initialProjects: ProjectData[] = [
  {
    projectName: 'Office Management',
    totalTime: '26h 15m',
    employees: [
      {
        id: 1,
        name: 'Shaun Farley',
        avatar: 'https://picsum.photos/seed/shaun/40/40',
        status: 'online',
        timeWorked: '26h 15m',
        progress: 100,
        tasks: [
          { name: 'Dashboard Design', time: '12h 30m', status: 'completed' },
          { name: 'User Research', time: '08h 15m', status: 'completed' },
          { name: 'Prototyping', time: '05h 30m', status: 'in-progress' }
        ]
      }
    ]
  },
  {
    projectName: 'E-Commerce Platform',
    totalTime: '42h 30m',
    employees: [
      {
        id: 2,
        name: 'Jenny Ellis',
        avatar: 'https://picsum.photos/seed/jenny/40/40',
        status: 'offline',
        timeWorked: '18h 45m',
        progress: 75,
        tasks: [
          { name: 'API Integration', time: '10h 00m', status: 'completed' },
          { name: 'Database Setup', time: '08h 45m', status: 'in-progress' }
        ]
      },
      {
        id: 3,
        name: 'Leon Baxter',
        avatar: 'https://picsum.photos/seed/leon/40/40',
        status: 'online',
        timeWorked: '23h 45m',
        progress: 85,
        tasks: [
          { name: 'Frontend Components', time: '15h 00m', status: 'completed' },
          { name: 'Unit Testing', time: '08h 45m', status: 'in-progress' }
        ]
      }
    ]
  }
];

export default function ProjectsTasksReportView() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('Office Management');
  const [expandedEmployee, setExpandedEmployee] = useState<number | null>(null);

  const currentProject = initialProjects.find(p => p.projectName === selectedProject) || initialProjects[0];

  const filteredEmployees = currentProject.employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects & Tasks</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-blue-600 cursor-pointer">Report</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Projects & Tasks</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Projects</p>
            <h3 className="text-xl font-bold text-gray-800">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks Completed</p>
            <h3 className="text-xl font-bold text-gray-800">148</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Time</p>
            <h3 className="text-xl font-bold text-gray-800">1,240h</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
            <BarChart3 size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productivity</p>
            <h3 className="text-xl font-bold text-gray-800">92%</h3>
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
        <div className="relative w-full lg:w-80">
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
            <select className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10">
              <option>All Employees</option>
              <option>Shaun Farley</option>
              <option>Jenny Ellis</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1 lg:flex-none">
            <select 
              className="w-full lg:w-48 appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option>All Projects</option>
              {initialProjects.map(p => <option key={p.projectName}>{p.projectName}</option>)}
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

      {/* Project Header */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">Project :</span>
          <span className="text-sm font-bold text-gray-800">{currentProject.projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium">Total Time Worked :</span>
          <span className="text-sm font-bold text-gray-800">{currentProject.totalTime}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Name</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-48">Time Worked</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status Bar</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEmployees.map((emp) => (
                <React.Fragment key={emp.id}>
                  <tr className="hover:bg-gray-50/50 transition-colors group">
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
                        <button 
                          onClick={() => setExpandedEmployee(expandedEmployee === emp.id ? null : emp.id)}
                          className="flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {emp.name}
                          <ChevronDown size={14} className={`transition-transform ${expandedEmployee === emp.id ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{emp.timeWorked}</td>
                    <td className="p-4">
                      <div className="w-full h-6 bg-gray-100 rounded-md overflow-hidden relative group/bar">
                        <div 
                          className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${emp.progress}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {emp.progress}% Complete
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                  {/* Expanded Tasks View */}
                  {expandedEmployee === emp.id && (
                    <tr className="bg-gray-50/30">
                      <td colSpan={4} className="p-4">
                        <div className="pl-12 space-y-3">
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tasks Breakdown</h5>
                          {emp.tasks.map((task, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm max-w-2xl">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                                <span className="text-sm font-medium text-gray-700">{task.name}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400">{task.time}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                          ))}
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-400 rounded-sm" />
            <span className="text-xs font-bold text-gray-500 uppercase">In Progress</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Layout size={14} />
          <p className="text-xs italic">Click on an employee name to view detailed task breakdown and individual task durations.</p>
        </div>
      </div>
    </div>
  );
}
