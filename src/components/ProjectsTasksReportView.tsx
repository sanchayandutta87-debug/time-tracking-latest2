import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Search, Calendar, Users, 
  Clock, Download, Printer, Filter, ChevronDown, 
  CheckSquare, BarChart3, TrendingUp, MoreVertical, 
  FileText, Layout, Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

export const projectsData: any[] = [];

export default function ProjectsTasksReportView() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  const fetchProjectData = async () => {
    setIsLoading(true);
    try {
      const { data: projData, error: projError } = await supabase
        .from('projects')
        .select('*');

      if (projError) throw projError;

      const { data: entries, error: entError } = await supabase
        .from('time_entries')
        .select(`
          *,
          users:user_id (full_name, avatar_url, last_seen),
          tasks:task_id (name, status)
        `);

      if (entError) throw entError;

      const formatted = (projData || []).map(project => {
        const projectEntries = (entries || []).filter(e => e.project_id === project.id);
        const totalSec = projectEntries.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        
        const employeeMap: any = {};
        projectEntries.forEach(entry => {
          const uid = entry.user_id;
          if (!employeeMap[uid]) {
            const lastSeenDate = entry.users?.last_seen ? new Date(entry.users.last_seen) : null;
            const isOnline = lastSeenDate ? (Date.now() - lastSeenDate.getTime()) < 300000 : false;

            employeeMap[uid] = {
              id: uid,
              name: entry.users?.full_name || 'Unknown',
              avatar: entry.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.users?.full_name || 'U')}&background=random`,
              status: isOnline ? 'online' : 'offline',
              totalSec: 0,
              tasks: []
            };
          }
          employeeMap[uid].totalSec += entry.duration_seconds || 0;
          employeeMap[uid].tasks.push({
            name: entry.tasks?.name || 'General Task',
            status: entry.tasks?.status || 'completed',
            time: `${Math.floor((entry.duration_seconds || 0) / 3600)}h ${Math.floor(((entry.duration_seconds || 0) % 3600) / 60)}m`
          });
        });

        const employees = Object.values(employeeMap).map((emp: any) => ({
          ...emp,
          timeWorked: `${Math.floor(emp.totalSec / 3600)}h ${Math.floor((emp.totalSec % 3600) / 60)}m`,
          progress: Math.min(100, Math.floor((emp.totalSec / 36000) * 100)) // Simulated progress
        }));

        return {
          projectName: project.name,
          totalTime: `${Math.floor(totalSec / 3600)}h ${Math.floor((totalSec % 3600) / 60)}m`,
          employees
        };
      });

      setProjects(formatted);
      if (formatted.length > 0 && !selectedProjectName) {
        setSelectedProjectName(formatted[0].projectName);
      }

    } catch (err) {
      console.error('Project report error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const currentProject = projects.find(p => p.projectName === selectedProjectName) || { projectName: '', totalTime: '0h', employees: [] };

  const filteredEmployees = currentProject.employees.filter((emp: any) => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Projects & Tasks</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Reports</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Projects & Tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <Layout size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Projects</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{projects.length}</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks Done</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>124</h3>
          </div>
        </div>
        <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm flex items-center gap-4`}>
          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Efficiency</p>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>94%</h3>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-sm mb-6`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
              <select className={`appearance-none border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 pr-10 min-w-[200px] ${darkMode ? 'bg-black border-gray-800 text-white' : 'bg-gray-50 border-gray-200'}`} value={selectedProjectName} onChange={(e) => setSelectedProjectName(e.target.value)}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.projectName} value={p.projectName}>{p.projectName}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className={`rounded-xl border shadow-sm overflow-hidden relative min-h-[400px] ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-bold text-gray-500">Mapping project logs...</p>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-100'} border-b`}>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Employee</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time Worked</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Progress</th>
                <th className={`p-4 text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-50'}`}>
              {filteredEmployees.map((emp: any) => (
                <React.Fragment key={emp.id}>
                  <tr className={`transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <button 
                          onClick={() => setExpandedEmployee(expandedEmployee === emp.id ? null : emp.id)}
                          className={`flex items-center gap-1 text-sm font-bold hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                          {emp.name}
                          <ChevronDown size={14} className={`transition-transform ${expandedEmployee === emp.id ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{emp.timeWorked}</span>
                    </td>
                    <td className="p-4">
                      <div className={`w-32 h-6 rounded-md overflow-hidden relative ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${emp.progress}%` }} />
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                          {emp.progress}%
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                  {expandedEmployee === emp.id && (
                    <tr>
                      <td colSpan={4} className={`p-0 ${darkMode ? 'bg-gray-900/20' : 'bg-gray-50/30'}`}>
                        <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                           <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Task Activity</h5>
                           <div className="space-y-3">
                            {emp.tasks.map((task: any, idx: number) => (
                              <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{task.name}</span>
                                </div>
                                <span className="text-xs font-bold text-blue-500">{task.time}</span>
                              </div>
                            ))}
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!isLoading && filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500 font-bold">No data found for this project.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
