import React from 'react';
import { Search, Plus, ChevronRight, MoreVertical, LayoutGrid, Archive, CheckSquare, Clock, Flag } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const projectStats = [
  { 
    title: 'Projects', 
    value: '2520', 
    color: '#8b5cf6', 
    icon: <LayoutGrid size={20} />,
    data: [{v: 10}, {v: 25}, {v: 15}, {v: 30}, {v: 20}, {v: 35}, {v: 25}]
  },
  { 
    title: 'Active', 
    value: '2502', 
    color: '#f59e0b', 
    icon: <Clock size={20} />,
    data: [{v: 15}, {v: 10}, {v: 25}, {v: 18}, {v: 30}, {v: 22}, {v: 35}]
  },
  { 
    title: 'InProgress', 
    value: '65', 
    color: '#3b82f6', 
    icon: <ActivityIcon size={20} />,
    data: [{v: 20}, {v: 35}, {v: 25}, {v: 40}, {v: 30}, {v: 45}, {v: 35}]
  },
  { 
    title: 'Completed', 
    value: '15', 
    color: '#ec4899', 
    icon: <CheckSquare size={20} />,
    data: [{v: 10}, {v: 20}, {v: 15}, {v: 25}, {v: 20}, {v: 30}, {v: 25}]
  },
];

function ActivityIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

const projectsData = [
  {
    code: '#PRJ0020',
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    projectName: 'Office Management',
    priority: 'Low',
    spentTime: '90h 40m',
    createdDate: '24 Dec 2025',
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    code: '#PRJ0019',
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    projectName: 'Clinic Management',
    priority: 'High',
    spentTime: '80h 45m',
    createdDate: '10 Dec 2025',
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    code: '#PRJ0018',
    name: 'Leon Baxter',
    role: 'Senior Manager',
    projectName: 'Educational Platform',
    priority: 'Medium',
    spentTime: '60h 20m',
    createdDate: '27 Nov 2025',
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    code: '#PRJ0017',
    name: 'Karen Flores',
    role: 'SEO Analyst',
    projectName: 'Chat & Call Mobile App',
    priority: 'High',
    spentTime: '45h 00m',
    createdDate: '27 Nov 2025',
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    code: '#PRJ0016',
    name: 'Charles Cline',
    role: 'HR Assistant',
    projectName: 'Travel Planning Website',
    priority: 'High',
    spentTime: '38h 15m',
    createdDate: '06 Nov 2025',
    avatar: 'https://picsum.photos/seed/charles/40/40'
  }
];

export default function ManageProjectsView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Projects</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
            
            <div className="w-24 h-12 z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.data}>
                  <Area 
                    type="monotone" 
                    dataKey="v" 
                    stroke={stat.color} 
                    fill={stat.color} 
                    fillOpacity={0.1} 
                    strokeWidth={2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
        <button className="flex items-center gap-2 pb-4 text-blue-600 font-bold border-b-2 border-blue-600">
          <LayoutGrid size={16} /> Active
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <Archive size={16} /> Archived
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <CheckSquare size={16} /> Completed
        </button>
        <button className="flex items-center gap-2 pb-4 text-gray-500 font-bold hover:text-gray-700">
          <Clock size={16} /> On Hold
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input type="text" placeholder="Search Keyword" className="outline-none w-full text-sm" />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="bg-white border border-gray-100 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            Sort By : Newest
          </button>
          
          <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Project Code</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Project Name</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Priority</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Spent Time (H)</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Created Date</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projectsData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={row.avatar} 
                          alt={row.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">{row.projectName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md w-fit ${
                      row.priority === 'High' ? 'bg-red-50 text-red-500' : 
                      row.priority === 'Medium' ? 'bg-orange-50 text-orange-500' : 
                      'bg-blue-50 text-blue-500'
                    }`}>
                      <Flag size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{row.priority}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.spentTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 font-medium">{row.createdDate}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
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
