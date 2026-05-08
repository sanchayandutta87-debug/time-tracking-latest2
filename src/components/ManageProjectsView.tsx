import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronRight, MoreVertical, LayoutGrid, Archive, CheckSquare, Clock, Flag, UserCheck, AlertCircle, Trash2, Edit2, X, ChevronDown, User, File, UploadCloud, Download } from 'lucide-react';
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

import { supabase } from '../utils/supabase';
import { useAppContext } from '../context/AppContext';

export default function ManageProjectsView() {
  const { darkMode, showToast, askConfirm } = useAppContext();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Modals & Dropdowns State
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Sorting State
  const [sortOption, setSortOption] = useState<'Newest' | 'Oldest' | 'Priority'>('Newest');

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients (name),
          tasks (
            id,
            assignee_id,
            priority,
            users (full_name, avatar_url, job_title)
          )
        `);

      if (error) throw error;

      // Map DB data to UI format
      const formatted = (data || []).map(p => {
        // Collect all unique members from tasks
        const teamMap = new Map();
        p.tasks?.forEach((t: any) => {
          if (t.users) {
            teamMap.set(t.users.full_name, t.users);
          }
        });
        const team = Array.from(teamMap.values());
        
        const primaryMember = team[0] || null;
        const dbPriority = p.tasks?.[0]?.priority || 'medium';

        return {
          id: p.id,
          code: `#${p.id.slice(0, 7).toUpperCase()}`,
          name: primaryMember?.full_name || 'Unassigned',
          role: primaryMember?.job_title || 'N/A',
          projectName: p.name,
          team: team, // Store full team list
          priority: dbPriority.charAt(0).toUpperCase() + dbPriority.slice(1),
          status: p.status === 'in_progress' ? 'Active' : 
                  p.status === 'completed' ? 'Completed' : 
                  p.status === 'on_hold' ? 'Pending' : 'Active',
          spentTime: '0h 0m', 
          createdDate: new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          timestamp: new Date(p.created_at).getTime(),
          avatar: primaryMember?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random`
        };
      });

      setProjects(formatted);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [users, setUsers] = useState<any[]>([]);
  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('id, full_name, avatar_url, job_title');
    setUsers(data || []);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();

    const subscription = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchProjects())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchProjects())
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add Form State
  const [formData, setFormData] = useState({ 
    projectName: '', 
    assignedUserIds: [] as string[], 
    role: 'Developer', 
    priority: 'Medium', 
    status: 'Active' 
  });

  const toggleUserAssignment = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedUserIds: prev.assignedUserIds.includes(userId)
        ? prev.assignedUserIds.filter(id => id !== userId)
        : [...prev.assignedUserIds, userId]
    }));
  };

  // Calculate Dynamic Stats
  const activeCount = projects.filter(p => p.status === 'Active').length;
  const inProgressCount = projects.filter(p => p.status === 'Active' || p.status === 'Pending' || p.status === 'Assigned').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  
  const projectStats = [
    { 
      title: 'Total Projects', value: projects.length.toString(), color: '#8b5cf6', icon: <LayoutGrid size={20} />,
      data: [{v: 10}, {v: 25}, {v: projects.length * 2}, {v: 20}]
    },
    { 
      title: 'Active', value: activeCount.toString(), color: '#f59e0b', icon: <Clock size={20} />,
      data: [{v: 15}, {v: activeCount * 4}, {v: 18}, {v: 35}]
    },
    { 
      title: 'In Progress', value: inProgressCount.toString(), color: '#3b82f6', icon: <ActivityIcon size={20} />,
      data: [{v: 20}, {v: inProgressCount * 5}, {v: 30}]
    },
    { 
      title: 'Completed', value: completedCount.toString(), color: '#10b981', icon: <CheckSquare size={20} />,
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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleDelete = async (id: string) => {
    askConfirm('Delete Project', 'Are you sure you want to delete this project and all its tasks?', async () => {
    
    try {
      // 1. Delete related tasks first (Supabase FK safety)
      await supabase.from('tasks').delete().eq('project_id', id);
      
      // 2. Delete the project
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      
      setDropdownOpen(null);
      fetchProjects();
      showToast('Project deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      showToast('Failed to delete project: ' + error.message, 'error');
    }
  });
};

  const handleEditClick = (project: any) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      assignedUserIds: project.team?.map((m: any) => m.id) || [],
      role: project.role,
      priority: project.priority,
      status: project.status
    });
    setIsEditModalOpen(true);
    setDropdownOpen(null);
  };

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedProjectForTeam, setSelectedProjectForTeam] = useState<any>(null);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<any>(null);
  const [projectAttachments, setProjectAttachments] = useState<any[]>([]);

  const fetchAttachments = async (projectId: string) => {
    try {
      console.log('Fetching attachments for project:', projectId);
      const { data, error } = await supabase.storage
        .from('project-files')
        .list(projectId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        });
      
      if (error) {
        console.error('Storage listing error:', error);
        return;
      }

      if (data) {
        const files = data
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map(f => {
            // Remove the timestamp prefix (e.g., '1234567890_') for display
            const displayName = f.name.includes('_') ? f.name.split('_').slice(1).join('_') : f.name;
            return {
              name: displayName,
              url: supabase.storage.from('project-files').getPublicUrl(`${projectId}/${f.name}`).data.publicUrl
            };
          });
        console.log('Found files:', files);
        setProjectAttachments(files);
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
    }
  };

  const handleRowClick = (project: any) => {
    setSelectedProjectForDetails(project);
    setIsDetailsDrawerOpen(true);
    fetchAttachments(project.id);
  };

  const handleManageTeamClick = async (project: any) => {
    setSelectedProjectForTeam(project);
    setIsTeamModalOpen(true);
    setDropdownOpen(null);
    
    // Fetch current members for this specific project
    const { data, error } = await supabase
      .from('tasks')
      .select('assignee_id, users(full_name, avatar_url, job_title)')
      .eq('project_id', project.id);
    
    if (!error && data) {
      // Unique members only
      const unique = Array.from(new Set(data.map(t => t.assignee_id)))
        .map(id => data.find(t => t.assignee_id === id)?.users)
        .filter(Boolean);
      setProjectMembers(unique);
    }
  };

  const handleAddTeamMember = async (userId: string) => {
    if (!selectedProjectForTeam) return;
    
    try {
      const { error } = await supabase.from('tasks').insert([{
        project_id: selectedProjectForTeam.id,
        name: 'Project Membership',
        assignee_id: userId,
        priority: 'medium',
        status: 'todo'
      }]);
      
      if (error) throw error;
      
      // Refresh local list
      handleManageTeamClick(selectedProjectForTeam);
      fetchProjects();
    } catch (error) {
      console.error('Error adding team member:', error);
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    if (!selectedProjectForTeam) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('project_id', selectedProjectForTeam.id)
        .eq('assignee_id', userId);
      
      if (error) throw error;
      
      handleManageTeamClick(selectedProjectForTeam);
      fetchProjects();
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };

  const mapUIToDBStatus = (uiStatus: string): any => {
    const map: Record<string, string> = {
      'Active': 'active',
      'Pending': 'on_hold',
      'Assigned': 'active',
      'Incomplete': 'on_hold',
      'Completed': 'completed'
    };
    return map[uiStatus] || 'active';
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async (projectId: string) => {
    if (selectedFiles.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls = [];
    
    for (const file of selectedFiles) {
      const fileName = `${projectId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);
      
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(fileName);
        uploadedUrls.push({ name: file.name, url: publicUrl });
      }
    }
    
    setIsUploading(false);
    return uploadedUrls;
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.projectName) return;

    // Check file sizes
    const oversizedFiles = selectedFiles.filter(f => f.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showToast(`Some files are too large (max 50MB): ${oversizedFiles.map(f => f.name).join(', ')}`, 'error');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Create Project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: formData.projectName,
          status: mapUIToDBStatus(formData.status)
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Upload Files if any
      if (selectedFiles.length > 0) {
        await uploadFiles(projectData.id);
      }

      // 3. Create tasks for ALL selected employees
      if (formData.assignedUserIds.length > 0 && projectData) {
        const tasksToInsert = formData.assignedUserIds.map(userId => ({
          project_id: projectData.id,
          name: 'Project Membership',
          assignee_id: userId,
          priority: formData.priority.toLowerCase() as any,
          status: 'todo'
        }));
        await supabase.from('tasks').insert(tasksToInsert);
      }
      
      setIsAddModalOpen(false);
      setFormData({ projectName: '', assignedUserIds: [], role: 'Developer', priority: 'Medium', status: 'Active' });
      setSelectedFiles([]);
      fetchProjects(); 
      showToast('Project created successfully!');
    } catch (error: any) {
      console.error('Error adding project:', error);
      showToast('Error creating project: ' + (error.message || 'Unknown error'), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingProject) return;

    try {
      // 1. Update Project
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: formData.projectName,
          status: mapUIToDBStatus(formData.status)
        })
        .eq('id', editingProject.id);

      if (projectError) throw projectError;

      // 2. Update all related tasks to the new priority
      const { data: existingTasks, error: fetchTasksError } = await supabase
        .from('tasks')
        .select('id')
        .eq('project_id', editingProject.id);

      if (fetchTasksError) throw fetchTasksError;

      if (existingTasks && existingTasks.length > 0) {
        const { error: updateTaskError } = await supabase
          .from('tasks')
          .update({ priority: formData.priority.toLowerCase() as any })
          .eq('project_id', editingProject.id);
        if (updateTaskError) throw updateTaskError;
      } else {
        const { error: insertTaskError } = await supabase.from('tasks').insert([{
          project_id: editingProject.id,
          name: 'Project Priority Marker',
          priority: formData.priority.toLowerCase() as any,
          status: 'todo'
        }]);
        if (insertTaskError) throw insertTaskError;
      }
      
      setIsEditModalOpen(false);
      setEditingProject(null);
      fetchProjects(); 
      showToast('Project updated successfully!');
    } catch (error: any) {
      console.error('Error updating project:', error);
      showToast('Error updating project: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  return (
    <div className="p-0 lg:p-4 min-h-full relative">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Projects</h1>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
            <ChevronRight size={12} />
            <span className="text-gray-900 dark:text-gray-300">Project Management</span>
          </div>
        </div>
        
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
          <Plus size={18} strokeWidth={3} /> Add New Project
        </button>
      </div>

      {/* Stats Cards Dynamics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {projectStats.map((stat, i) => (
          <div key={i} className="bg-white/70 dark:bg-black p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/20 flex items-center justify-between relative overflow-hidden group transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-4 z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-current/20" style={{ backgroundColor: stat.color }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{stat.value}</p>
              </div>
            </div>
            <div className="w-24 h-14 z-10 opacity-40 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stat.data}>
                  <Area type="monotone" dataKey="v" stroke={stat.color} fill={stat.color} fillOpacity={0.1} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Filters Area */}
      <div className="bg-white/70 dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/20 p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button 
                key={tab.label}
                onClick={() => setActiveTab(tab.label)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                  activeTab === tab.label 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative group flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all dark:text-white" 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="bg-gray-50/50 dark:bg-black border border-gray-100 dark:border-gray-800 px-5 py-3.5 rounded-2xl text-sm font-black text-gray-700 dark:text-gray-300 shadow-sm hover:border-blue-500/50 transition-all flex items-center gap-2 active:scale-95"
              >
                <ChevronDown size={18} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                Sort: {sortOption}
              </button>

              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 z-40 animate-in fade-in slide-in-from-top-2">
                    {['Newest', 'Oldest', 'Priority'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => { setSortOption(opt as any); setIsSortOpen(false); }}
                        className={`block w-full text-left px-4 py-3 text-xs font-black rounded-xl transition-all ${sortOption === opt ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white/70 dark:bg-black rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-black/20 overflow-visible">
        <div className="overflow-x-auto overflow-y-visible min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-black">
                <th className="pl-10 pr-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Project Info</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Assigned Member</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Work Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Priority</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-center">Spent Time</th>
                <th className="px-6 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/50 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-32">
                    <div className="flex flex-col items-center justify-center gap-4">
                       <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                       <p className="text-sm font-bold text-gray-400 dark:text-slate-500 animate-pulse uppercase tracking-widest">Fetching Projects...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? filteredProjects.map((row) => {
                const userStatus = getUserStatusFromProject(row.status, row.priority);
                
                return (
                  <tr 
                    key={row.id} 
                    onClick={() => handleRowClick(row)}
                    className="hover:bg-blue-600/5 transition-all group cursor-pointer"
                  >
                    <td className="pl-10 pr-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{row.projectName}</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{row.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-4 overflow-visible">
                          {row.team && row.team.length > 0 ? (
                            row.team.slice(0, 3).map((member: any, i: number) => (
                              <div key={i} className="relative group/avatar">
                                <div className="w-11 h-11 rounded-2xl border-2 border-white dark:border-gray-800 shadow-xl overflow-hidden group-hover:scale-110 transition-all duration-300">
                                  <img 
                                    src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=random`} 
                                    alt={member.full_name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-[10px] text-white rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none border border-white/10 shadow-2xl">
                                  {member.full_name}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-black border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                              <User size={16} className="text-gray-400" />
                            </div>
                          )}
                          {row.team && row.team.length > 3 && (
                            <div className="w-11 h-11 rounded-2xl bg-blue-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-black text-white shadow-xl z-[5]">
                              +{row.team.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 pl-2">
                          <span className="text-sm font-black text-gray-900 dark:text-white truncate">
                            {row.name}
                            {row.team && row.team.length > 1 && <span className="text-blue-500 ml-1">+{row.team.length - 1}</span>}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate mt-0.5">{row.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <div className="flex justify-center">
                         <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black border uppercase tracking-wider ${
                           userStatus.label === 'Overloaded' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                           userStatus.label === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                           'bg-blue-500/10 text-blue-500 border-blue-500/20'
                         }`}>
                            <span className="mr-2 w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                            {userStatus.label}
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex justify-center">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                          row.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                          row.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          <Flag size={12} fill="currentColor" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{row.priority}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-black px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-gray-800">{row.spentTime}</span>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-tighter">Since {row.createdDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right pr-10 relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === row.id ? null : row.id); }}
                        className={`p-2 rounded-xl transition-all active:scale-90 ${dropdownOpen === row.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-900'}`}
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {/* Interactive Dropdown Menu */}
                      {dropdownOpen === row.id && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(null)}></div>
                          <div className="absolute right-10 top-16 z-50 w-52 bg-white dark:bg-black rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-2 animate-in fade-in slide-in-from-top-4 flex flex-col">
                            <button 
                              onClick={() => handleEditClick(row)}
                              className="flex items-center gap-3 px-4 py-3 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                            >
                              <Edit2 size={16} className="text-blue-500" /> Edit Project
                            </button>
                            <button 
                              onClick={() => handleManageTeamClick(row)}
                              className="flex items-center gap-3 px-4 py-3 text-xs font-black text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                            >
                              <UserCheck size={16} className="text-emerald-500" /> Manage Team
                            </button>
                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>
                            <button 
                              onClick={() => handleDelete(row.id)}
                              className="flex items-center gap-3 px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                            >
                              <Trash2 size={16} /> Delete Project
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
 : (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <Search size={48} className="text-gray-200 dark:text-gray-800 mx-auto mb-4" />
                      <p className="text-lg font-bold text-gray-300 dark:text-gray-700 mb-2">No Projects Found</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 uppercase tracking-widest">Adjust your filters or search terms</p>
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
            
            <div className="flex items-center justify-between p-8 border-b border-white/5 shrink-0">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Add New Project</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Setup your next big venture</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.projectName}
                    onChange={e => setFormData({...formData, projectName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                    placeholder="e.g., Nexus Mobile App"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Assigned To</label>
                    <div className="relative">
                      <select 
                        onChange={(e) => {
                          if (e.target.value) {
                            toggleUserAssignment(e.target.value);
                            e.target.value = ''; // Reset select after picking
                          }
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                        value=""
                      >
                        <option value="" className="bg-black text-gray-500">Add Team Member...</option>
                        {users
                          .filter(u => !formData.assignedUserIds.includes(u.id))
                          .map(u => (
                            <option key={u.id} value={u.id} className="bg-black text-white">{u.full_name}</option>
                          ))
                        }
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                    
                    {/* Selected Member Tags */}
                    {formData.assignedUserIds.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 p-2 bg-white/5 rounded-xl border border-white/5">
                        {formData.assignedUserIds.map(userId => {
                          const user = users.find(u => u.id === userId);
                          return (
                            <div key={userId} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                              <span className="text-[10px] font-black uppercase tracking-wider">{user?.full_name}</span>
                              <button type="button" onClick={() => toggleUserAssignment(userId)} className="hover:text-white transition-colors">
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Primary Role</label>
                    <div className="relative">
                      <select 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                      >
                        <option value="Developer" className="bg-black text-white">Developer</option>
                        <option value="Designer" className="bg-black text-white">Designer</option>
                        <option value="Manager" className="bg-black text-white">Manager</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Priority</label>
                    <div className="relative">
                      <select 
                        value={formData.priority}
                        onChange={e => setFormData({...formData, priority: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                      >
                        <option value="Low" className="bg-black text-white">Low</option>
                        <option value="Medium" className="bg-black text-white">Medium</option>
                        <option value="High" className="bg-black text-white">High</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Initial Status</label>
                    <div className="relative">
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({...formData, status: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                      >
                        <option value="Active" className="bg-black text-white">Active</option>
                        <option value="Pending" className="bg-black text-white">Pending</option>
                        <option value="Assigned" className="bg-black text-white">Assigned</option>
                        <option value="Incomplete" className="bg-black text-white">Incomplete</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Project Files</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-white/10 group-hover:border-blue-500/50 rounded-2xl p-8 transition-all bg-white/5 flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-black text-white">Drop files or click to upload</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">PDF, ZIP, DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-3">
                            <File size={16} className="text-blue-400" />
                            <span className="text-xs font-bold text-gray-300 truncate max-w-[200px]">{f.name}</span>
                          </div>
                          <span className="text-[9px] font-black text-gray-500 uppercase">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/20 flex gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white/5 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
                >
                  {isUploading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Project Modal Setup */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="bg-black/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-lg relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600"></div>
            
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Edit Project</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Update project details</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Project Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.projectName}
                  onChange={e => setFormData({...formData, projectName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Priority</label>
                  <div className="relative">
                    <select 
                      value={formData.priority}
                      onChange={e => setFormData({...formData, priority: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                    >
                      <option value="Low" className="bg-black text-white">Low</option>
                      <option value="Medium" className="bg-black text-white">Medium</option>
                      <option value="High" className="bg-black text-white">High</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Status</label>
                  <div className="relative">
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                    >
                      <option value="Active" className="bg-black text-white">Active</option>
                      <option value="Pending" className="bg-black text-white">Pending</option>
                      <option value="Assigned" className="bg-black text-white">Assigned</option>
                      <option value="Incomplete" className="bg-black text-white">Incomplete</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white/5 text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all active:scale-95 border border-white/5"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Manage Team Modal */}
      {isTeamModalOpen && selectedProjectForTeam && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="bg-black/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl w-full max-w-xl relative z-10 border border-white/10 animate-in fade-in zoom-in-95 duration-300 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Manage Team</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{selectedProjectForTeam.projectName}</p>
              </div>
              <button onClick={() => setIsTeamModalOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              {/* Current Members Section */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Current Members ({projectMembers.length})</h3>
                <div className="grid grid-cols-1 gap-3">
                  {projectMembers.length > 0 ? projectMembers.map((member: any, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}`} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                        <div>
                          <p className="text-sm font-black text-white">{member.full_name}</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{member.job_title || 'Team Member'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )) : (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <p className="text-sm font-bold text-gray-500">No members assigned yet.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add New Member Section */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Add Team Member</h3>
                <div className="relative">
                  <select 
                    onChange={(e) => e.target.value && handleAddTeamMember(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none appearance-none transition-all"
                    value=""
                  >
                    <option value="" className="bg-black text-gray-500">Choose an employee...</option>
                    {users
                      .filter(u => !projectMembers.some(m => m.id === u.id))
                      .map(u => (
                        <option key={u.id} value={u.id} className="bg-black text-white">{u.full_name}</option>
                      ))
                    }
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="p-8 bg-black/20">
              <button 
                onClick={() => setIsTeamModalOpen(false)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Project Details Insight Drawer */}
      {isDetailsDrawerOpen && selectedProjectForDetails && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDetailsDrawerOpen(false)}></div>
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md animate-in slide-in-from-right duration-500">
              <div className="h-full flex flex-col bg-black/95 backdrop-blur-3xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-600 via-purple-600 to-blue-600"></div>
                
                <div className="p-8 flex items-center justify-between border-b border-white/5">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Project Insight</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">{selectedProjectForDetails.code}</p>
                  </div>
                  <button onClick={() => setIsDetailsDrawerOpen(false)} className="text-gray-400 hover:text-white hover:bg-white/5 p-3 rounded-2xl transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10">
                  {/* Project Info Section */}
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-white leading-tight">{selectedProjectForDetails.projectName}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        selectedProjectForDetails.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        selectedProjectForDetails.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {selectedProjectForDetails.priority} Priority
                      </span>
                      <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 border border-white/10">
                        {selectedProjectForDetails.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                      This project focuses on delivering high-performance solutions for our core objectives. Our team is working closely to ensure quality and timely delivery of all key features and milestones.
                    </p>
                  </div>

                  {/* Team Members Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Project Team ({selectedProjectForDetails.team?.length || 0})</h4>
                    </div>
                    <div className="space-y-3">
                      {selectedProjectForDetails.team?.map((member: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-400/30 transition-all">
                          <img 
                            src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}`} 
                            className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                            alt="" 
                          />
                          <div>
                            <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{member.full_name}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{member.job_title || 'Expert'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Files Section */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Project Files ({projectAttachments.length})</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {projectAttachments.length > 0 ? projectAttachments.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                              <File size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white truncate max-w-[180px]">{file.name}</p>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Document</p>
                            </div>
                          </div>
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      )) : (
                        <div className="p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                          <p className="text-sm font-bold text-gray-500">No files attached yet.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Spent</p>
                      <p className="text-2xl font-black text-white">{selectedProjectForDetails.spentTime}</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Since</p>
                      <p className="text-sm font-black text-white">{selectedProjectForDetails.createdDate}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-black/20">
                  <button 
                    onClick={() => setIsDetailsDrawerOpen(false)}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    Close Insight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
