import React, { useState } from 'react';
import { Search, Plus, ChevronRight, MoreVertical, LayoutGrid, Archive, CheckSquare, Clock, Flag, UserCheck, AlertCircle, Trash2, Edit2, X, ChevronDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

function ActivityIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

// Initial Data
const initialProjectsData = [
  {
    code: '#PRJ0020',
    name: 'Shaun Farley',
    role: 'UI/UX Designer',
    projectName: 'Office Management',
    priority: 'Low',
    status: 'Active',
    spentTime: '90h 40m',
    createdDate: '24 Dec 2025',
    timestamp: new Date('2025-12-24').getTime(),
    avatar: 'https://picsum.photos/seed/shaun/40/40'
  },
  {
    code: '#PRJ0019',
    name: 'Jenny Ellis',
    role: 'PHP Developer',
    projectName: 'Clinic Management',
    priority: 'High',
    status: 'Pending',
    spentTime: '80h 45m',
    createdDate: '10 Dec 2025',
    timestamp: new Date('2025-12-10').getTime(),
    avatar: 'https://picsum.photos/seed/jenny/40/40'
  },
  {
    code: '#PRJ0018',
    name: 'Leon Baxter',
    role: 'Senior Manager',
    projectName: 'Educational Platform',
    priority: 'Medium',
    status: 'Incomplete',
    spentTime: '60h 20m',
    createdDate: '27 Nov 2025',
    timestamp: new Date('2025-11-27').getTime(),
    avatar: 'https://picsum.photos/seed/leon/40/40'
  },
  {
    code: '#PRJ0017',
    name: 'Karen Flores',
    role: 'SEO Analyst',
    projectName: 'Chat & Call App',
    priority: 'High',
    status: 'Assigned',
    spentTime: '45h 00m',
    createdDate: '27 Nov 2025',
    timestamp: new Date('2025-11-27T10:00:00').getTime(),
    avatar: 'https://picsum.photos/seed/karen/40/40'
  },
  {
    code: '#PRJ0016',
    name: 'Charles Cline',
    role: 'HR Assistant',
    projectName: 'Travel Planning',
    priority: 'Low',
    status: 'Completed',
    spentTime: '38h 15m',
    createdDate: '06 Nov 2025',
    timestamp: new Date('2025-11-06').getTime(),
    avatar: 'https://picsum.photos/seed/charles/40/40'
  }
];

// Helper to deduce User Status from Project Status & Priority
function getUserStatusFromProject(status: string, priority: string) {
  if (status === 'Completed') return { label: 'Available', color: 'bg-green-100 text-green-700 border-green-200' };
  if (status === 'Pending' || status === 'On Hold') return { label: 'Idle / Waiting', color: 'bg-gray-100 text-gray-700 border-gray-200' };
  if (priority === 'High' && (status === 'Active' || status === 'Incomplete')) return { label: 'Overloaded', color: 'bg-red-100 text-red-700 border-red-200' };
  if (status === 'Assigned') return { label: 'Starting Soon', color: 'bg-blue-100 text-blue-700 border-blue-200' };
  return { label: 'Working', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }; 
}

export default function ManageProjectsView() {
  const [projects, setProjects] = useState(initialProjectsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Modals & Dropdowns State
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sorting State
  const [sortOption, setSortOption] = useState<'Newest' | 'Oldest' | 'Priority'>('Newest');

  // Add Form State
  const [formData, setFormData] = useState({
    projectName: '',
    name: '',
    role: 'Developer',
    priority: 'Medium',
    status: 'Active'
  });

  // Calculate Dynamic Stats
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const inProgressCount = projects.filter(p => p.status === 'Active' || p.status === 'Incomplete' || p.status === 'Assigned').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  
  const projectStats = [
    { 
      title: 'Projects', value: projects.length.toString(), color: '#8b5cf6', icon: <LayoutGrid size={20} />,
      data: [{v: 10}, {v: 25}, {v: projects.length * 2}, {v: 20}]
    },
    { 
      title: 'Active', value: activeCount.toString(), color: '#f59e0b', icon: <Clock size={20} />,
      data: [{v: 15}, {v: activeCount * 4}, {v: 18}, {v: 35}]
    },
    { 
      title: 'InProgress', value: inProgressCount.toString(), color: '#3b82f6', icon: <ActivityIcon size={20} />,
      data: [{v: 20}, {v: 35}, {v: inProgressCount * 5}, {v: 30}]
    },
    { 
      title: 'Completed', value: completedCount.toString(), color: '#ec4899', icon: <CheckSquare size={20} />,
      data: [{v: 10}, {v: completedCount * 10}, {v: 15}, {v: 25}]
    },
  ];

  const tabs = [
    { label: 'All', icon: <LayoutGrid size={16} /> },
    { label: 'Active', icon: <ActivityIcon size={16} /> },
    { label: 'Pending', icon: <Clock size={16} /> },
    { label: 'Assigned', icon: <UserCheck size={16} /> },
    { label: 'Incomplete', icon: <AlertCircle size={16} /> },
    { label: 'Completed', icon: <CheckSquare size={16} /> },
    { label: 'Archived', icon: <Archive size={16} /> },
  ];

  // Derive filtered and sorted projects
  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'All' || project.status === activeTab;
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = 
      project.name.toLowerCase().includes(lowerQuery) || 
      project.projectName.toLowerCase().includes(lowerQuery) || 
      project.code.toLowerCase().includes(lowerQuery);
    return matchesTab && matchesSearch;
  }).sort((a, b) => {
    if (sortOption === 'Newest') return b.timestamp - a.timestamp;
    if (sortOption === 'Oldest') return a.timestamp - b.timestamp;
    if (sortOption === 'Priority') {
      const pmap: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return (pmap[b.priority] || 0) - (pmap[a.priority] || 0);
    }
    return 0;
  });

  const handleDelete = (code: string) => {
    setProjects(projects.filter(p => p.code !== code));
    setDropdownOpen(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.projectName || !formData.name) return;

    const newId = `#PRJ${Math.floor(Math.random() * 9000) + 1000}`;
    const timestamp = new Date().getTime();
    const newProject = {
      code: newId,
      name: formData.name,
      role: formData.role,
      projectName: formData.projectName,
      priority: formData.priority,
      status: formData.status,
      spentTime: '0h 0m',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: timestamp,
      avatar: `https://picsum.photos/seed/${newId}/40/40`
    };
    
    setProjects([newProject, ...projects]);
    setIsAddModalOpen(false);
    setFormData({ projectName: '', name: '', role: 'Developer', priority: 'Medium', status: 'Active' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Projects</span>
        </div>
      </div>

      {/* Stats Cards Dynamics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group transition-all hover:shadow-md">
            <div className="flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-left">{stat.value}</p>
              </div>
            </div>
            <div className="w-24 h-12 z-10 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.data}>
                  <Area type="monotone" dataKey="v" stroke={stat.color} fill={stat.color} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-8 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button 
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`flex items-center gap-2 pb-4 font-bold transition-colors ${
              activeTab === tab.label 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Project Name or Code..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none w-full text-sm bg-transparent" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto relative">
          {/* Functional Sort Dropdown */}
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-white border border-gray-100 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2 active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
            Sort By : {sortOption}
          </button>

          {isSortOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)}></div>
              <div className="absolute top-12 right-32 z-40 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                {['Newest', 'Oldest', 'Priority'].map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setSortOption(opt as any); setIsSortOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${sortOption === opt ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
          
          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-visible">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Project Info</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Assigned User</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">User Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Priority</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800">Spent Time (H)</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-800 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProjects.length > 0 ? filteredProjects.map((row) => {
                const userStatus = getUserStatusFromProject(row.status, row.priority);
                
                return (
                  <tr key={row.code} className="hover:bg-gray-50 hover:shadow-sm transition-all group relative">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{row.projectName}</span>
                        <span className="text-xs text-gray-500 font-medium">{row.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img 
                            src={row.avatar} 
                            alt={row.name} 
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${userStatus.label === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-gray-900 truncate">{row.name}</span>
                          <span className="text-xs text-gray-500 font-medium truncate">{row.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${userStatus.color}`}>
                          <span className="mr-1.5 w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                          {userStatus.label}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                        row.priority === 'High' ? 'bg-red-50 text-red-600' : 
                        row.priority === 'Medium' ? 'bg-orange-50 text-orange-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        <Flag size={12} fill="currentColor" />
                        <span className="text-xs font-bold uppercase tracking-wider">{row.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900 font-bold">{row.spentTime}</span>
                        <span className="text-xs text-gray-400">Since {row.createdDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right pr-8 relative">
                      <button 
                        onClick={() => setDropdownOpen(dropdownOpen === row.code ? null : row.code)}
                        className={`p-2 rounded-lg transition-colors focus:outline-none ${dropdownOpen === row.code ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {/* Interactive Dropdown Menu */}
                      {dropdownOpen === row.code && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(null)}></div>
                          <div className="absolute right-8 top-12 z-50 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 flex flex-col text-left">
                            <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
                              <Edit2 size={16} className="text-gray-400" /> Edit Project
                            </button>
                            <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left">
                              <UserCheck size={16} className="text-gray-400" /> Manage Team
                            </button>
                            <div className="h-px bg-gray-100 my-1 w-full"></div>
                            <button 
                              onClick={() => handleDelete(row.code)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors w-full text-left"
                            >
                              <Trash2 size={16} className="text-red-500" /> Delete Project
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Search size={32} className="text-gray-300" />
                      <p className="text-sm font-medium">No projects found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Project Modal Setup */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.projectName}
                  onChange={e => setFormData({...formData, projectName: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., Nexus Mobile App"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Assigned To</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="User Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                  <div className="relative">
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all bg-white"
                    >
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                      <option value="Analyst">Analyst</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Priority</label>
                  <div className="relative">
                    <select 
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all bg-white"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Initial Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none transition-all bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Incomplete">Incomplete</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 font-medium">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
