import React from 'react';
import { Search, Plus, ChevronRight, MoreVertical, LayoutGrid, Archive, CheckSquare, Clock, Flag, List, Grid, ArrowUpDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const tasksData = [
  {
    id: '#TA23174',
    project: 'Office Management',
    task: 'Creating Application Modules',
    createdOn: '24 Dec 2025',
    totalHours: '30h 00m',
    priority: 'Low',
    assignee: 'Shaun Farley',
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    id: '#TA23173',
    project: 'Service Management App',
    task: 'Creating Application Modules',
    createdOn: '10 Dec 2025',
    totalHours: '22h 30m',
    priority: 'High',
    assignee: 'Jenny Ellis',
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    id: '#TA23172',
    project: 'Advanced Booking System',
    task: 'Develop Workflows & Rules',
    createdOn: '27 Nov 2025',
    totalHours: '15h 30m',
    priority: 'Medium',
    assignee: 'Leon Baxter',
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    id: '#TA23171',
    project: 'Food Order App',
    task: 'Ad Setup & Campaign Management',
    createdOn: '27 Nov 2025',
    totalHours: '22h 15m',
    priority: 'High',
    assignee: 'Karen Flores',
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    id: '#TA23170',
    project: 'Truelysell',
    task: 'Integration & API Testing',
    createdOn: '06 Nov 2025',
    totalHours: '12h 50m',
    priority: 'High',
    assignee: 'Charles Cline',
    avatar: 'https://picsum.photos/seed/charles/40/40'
  },
  {
    id: '#TA23169',
    project: 'Dreamschat',
    task: 'Performance Monitoring & Optimization',
    createdOn: '25 Oct 2025',
    totalHours: '15h 30m',
    priority: 'High',
    assignee: 'Aliza Duncan',
    avatar: 'https://picsum.photos/seed/aliza/40/40'
  }
];

export default function TasksView() {
  const { darkMode } = useAppContext();

  return (
    <div className="p-8 bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">Tasks</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 mb-8">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          <LayoutGrid size={16} /> Active
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200">
          <Clock size={16} /> On Hold
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200">
          <CheckSquare size={16} /> Completed
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 dark:text-gray-400 font-bold hover:text-gray-700 dark:hover:text-gray-200">
          <Archive size={16} /> Archived
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white dark:bg-black flex items-center gap-2 border border-gray-100 dark:border-gray-800 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm bg-transparent dark:text-white dark:placeholder-gray-600" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-1 shadow-sm">
            <button className="p-1.5 bg-gray-900 dark:bg-blue-600 text-white rounded-md">
              <List size={18} />
            </button>
            <button className="p-1.5 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-md">
              <Grid size={18} />
            </button>
          </div>

          <button className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center gap-2">
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-black/20">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Task ID</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Project & Task</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Created On</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Total Hours</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Priority</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400">Assignee</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {tasksData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 bg-transparent text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{row.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{row.project}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{row.task}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{row.createdOn}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-gray-900 dark:text-white">{row.totalHours}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit ${
                      row.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 
                      row.priority === 'Medium' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500' : 
                      'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500'
                    }`}>
                      <Flag size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{row.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={row.avatar} 
                          alt={row.assignee} 
                          className="w-10 h-10 rounded-full object-cover border border-white dark:border-gray-800 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{row.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
