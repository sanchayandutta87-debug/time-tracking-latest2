import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  Calendar, ArrowUpDown, Users, UserCheck, UserX, Archive,
  TrendingUp, TrendingDown, Loader2, Mail, Phone
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import AddEmployeeModal from './AddEmployeeModal';

interface Employee {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  team: string;
  address: string;
  shift: 'Day' | 'Night' | 'Evening';
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Archived';
  isOnline: boolean;
  avatar: string;
  joinDate: string;
}

export default function EmployeesView() {
  const { darkMode } = useAppContext();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [activeTab, setActiveTab] = useState<'Active' | 'Inactive' | 'Archived'>('Active');

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all users
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*');

      if (userError) throw userError;

      // 2. Fetch active time entries
      const { data: activeEntries, error: entryError } = await supabase
        .from('time_entries')
        .select('user_id')
        .is('end_time', null);

      if (entryError) throw entryError;

      const activeUserIds = new Set((activeEntries || []).map(e => e.user_id));

      const formattedData: Employee[] = (users || []).map(user => {
        const lastSeen = user.last_seen ? new Date(user.last_seen).getTime() : 0;
        const now = new Date().getTime();
        const isRecentlyActive = (now - lastSeen) < 120000;
        const isTracking = activeUserIds.has(user.id);

        return {
          id: user.id,
          name: user.full_name,
          role: user.job_title || 'Employee',
          designation: user.designation || user.job_title || 'Staff',
          department: user.department || 'General',
          team: user.team || 'Standard',
          address: user.address || '',
          shift: user.shift || 'Day',
          email: user.email,
          phone: user.phone || 'N/A',
          status: isTracking ? 'Active' : (user.status || 'Inactive'),
          isOnline: isTracking || isRecentlyActive,
          avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`,
          joinDate: user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : '2024-01-01'
        };
      });

      setEmployees(formattedData);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();

    const subscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchEmployees();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSaveEmployee = async (employeeData: Employee) => {
    // In a real app, you'd save to Supabase here
    // For now, let's update locally to show immediate feedback
    if (editingEmployee) {
      setEmployees(prev => prev.map(e => e.id === employeeData.id ? employeeData : e));
    } else {
      setEmployees(prev => [employeeData, ...prev]);
    }
    fetchEmployees(); // Refresh from DB
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = emp.status === activeTab;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { title: 'Total Employees', value: employees.length, color: 'bg-purple-600', icon: <Users size={20} />, change: '+2.5%' },
    { title: 'Active', value: employees.filter(e => e.status === 'Active').length, color: 'bg-emerald-500', icon: <UserCheck size={20} />, change: '+1.2%' },
    { title: 'Inactive', value: employees.filter(e => e.status === 'Inactive').length, color: 'bg-orange-500', icon: <UserX size={20} />, change: '-0.5%' },
    { title: 'Archived', value: employees.filter(e => e.status === 'Archived').length, color: 'bg-pink-600', icon: <Archive size={20} />, change: '0%' },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-transparent min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Employees</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-300">Employees</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-slate-700 mb-8 overflow-x-auto whitespace-nowrap">
        {(['Active', 'Inactive', 'Archived'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-bold text-sm transition-all ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            {tab} Employees
          </button>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 flex items-center gap-2 border border-gray-100 dark:border-slate-700 rounded-lg px-3 py-2.5 w-full lg:w-80 shadow-sm">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="outline-none w-full text-sm bg-transparent dark:text-white dark:placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-gray-900 dark:bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-gray-900 dark:bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
            >
              <Grid size={18} />
            </button>
          </div>

          <button className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-slate-300 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" /> Date Filter
          </button>
          
          <button 
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Syncing personnel records...</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 dark:border-slate-700">
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Name</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Team</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Email Address</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-800 dark:text-slate-200">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={emp.avatar} 
                            className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-slate-600"
                            referrerPolicy="no-referrer"
                          />
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${emp.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{emp.name}</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{emp.team}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-slate-400 font-medium">{emp.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {emp.status === 'Active' && emp.isOnline && (
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Actively Tracking Time" />
                        )}
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          emp.status === 'Active' && emp.isOnline ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                          emp.status === 'Inactive' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' :
                          emp.status === 'Archived' ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600' :
                          'bg-gray-50 dark:bg-gray-800 text-gray-500'
                        }`}>
                          {emp.status === 'Active' && emp.isOnline ? 'Tracking Now' : (emp.status === 'Active' ? 'Offline' : emp.status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center text-gray-400">No personnel records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <img src={emp.avatar} className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-700 shadow-lg" referrerPolicy="no-referrer" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">{emp.name}</h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">{emp.role}</p>
                  
                  <div className="w-full space-y-3 pt-4 border-t border-gray-50 dark:border-slate-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                      <Mail size={14} className="text-gray-400" /> {emp.email}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                      <Phone size={14} className="text-gray-400" /> {emp.phone}
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setEditingEmployee(emp);
                      setIsModalOpen(true);
                    }}
                    className="mt-6 w-full py-2.5 rounded-xl border border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddEmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={editingEmployee}
      />
    </div>
  );
}
