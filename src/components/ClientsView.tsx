import React from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  ArrowUpDown, Users, UserCheck, UserX, Archive,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../context/AppContext';
import AddClientModal from './AddClientModal';

export default function ClientsView() {
  const { darkMode } = useAppContext();
  const [clients, setClients] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<any>(null);
  const [stats, setStats] = React.useState({
    total: 0,
    active: 0,
    inactive: 0,
    archived: 0
  });

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      // 2. Fetch projects to count per client
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, client_id');

      if (projectsError) throw projectsError;

      // 3. Process data
      const projectCounts = (projectsData || []).reduce((acc: any, p) => {
        if (p.client_id) {
          acc[p.client_id] = (acc[p.client_id] || 0) + 1;
        }
        return acc;
      }, {});

      const formattedClients = (clientsData || []).map(c => ({
        ...c,
        projects: projectCounts[c.id] || 0,
        status: 'Active' // Defaulting to Active as there's no status column
      }));

      setClients(formattedClients);
      
      // Update stats
      setStats({
        total: formattedClients.length,
        active: formattedClients.length, // All active for now
        inactive: 0,
        archived: 0
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClients();
  }, []);

  const handleSaveClient = async (clientData: any) => {
    try {
      const dbData = {
        name: clientData.name,
        company_name: clientData.company,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        website: clientData.website || '',
      };

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(dbData)
          .eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([dbData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client: ' + (error as any).message);
    }
  };

  const clientStats = [
    { 
      title: 'Total Clients', 
      value: stats.total.toString(), 
      change: '0%', 
      trend: 'up',
      color: 'bg-blue-600', 
      icon: <Users size={20} /> 
    },
    { 
      title: 'Active Clients', 
      value: stats.active.toString(), 
      change: '0%', 
      trend: 'up',
      color: 'bg-emerald-500', 
      icon: <UserCheck size={20} /> 
    },
    { 
      title: 'Inactive Clients', 
      value: stats.inactive.toString(), 
      change: '0%', 
      trend: 'up',
      color: 'bg-orange-500', 
      icon: <UserX size={20} /> 
    },
    { 
      title: 'Archived Clients', 
      value: stats.archived.toString(), 
      change: '0%', 
      trend: 'down',
      color: 'bg-pink-600', 
      icon: <Archive size={20} /> 
    },
  ];
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-full ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Clients</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Clients</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {clientStats.map((stat, i) => (
          <div key={i} className={`${darkMode ? 'bg-[#0A0A0B]/80 border-white/5 shadow-2xl' : 'bg-white border-gray-100 shadow-sm'} p-6 rounded-xl border relative overflow-hidden group transition-all`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 mb-1 tracking-wider uppercase">{stat.title}</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color} transform group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className={`${darkMode ? 'bg-[#0A0A0B]/60 border-white/5' : 'bg-white border-gray-200'} flex items-center gap-2 border rounded-lg px-3 py-2.5 w-full lg:w-80 shadow-sm transition-all`}>
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="outline-none w-full text-sm bg-transparent" 
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className={`${darkMode ? 'bg-[#0A0A0B]/60 border-white/5' : 'bg-white border-gray-200'} flex border rounded-lg p-1 shadow-sm`}>
            <button className={`p-1.5 ${darkMode ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'} rounded-md`}>
              <List size={18} />
            </button>
            <button className={`p-1.5 text-gray-400 hover:bg-white/5 rounded-md`}>
              <Grid size={18} />
            </button>
          </div>

          <button className={`${darkMode ? 'bg-[#0A0A0B]/60 border-white/5 text-gray-300 hover:bg-white/5' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'} border px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all`}>
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button 
            onClick={() => {
              setEditingClient(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            <Plus size={18} /> Add New
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className={`${darkMode ? 'bg-[#0A0A0B]/80 border-white/5' : 'bg-white border-gray-100'} rounded-xl border shadow-sm overflow-hidden transition-all`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Client</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Company Name</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Email Address</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Phone</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>No of Projects</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Created Date</th>
                <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
              {clients.map((client, i) => (
                <tr key={i} className={`hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-colors group`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={client.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`} 
                          alt={client.name} 
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 ${darkMode ? 'border-[#0A0A0B]' : 'border-white'} rounded-full`}></div>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{client.name}</p>
                        <p className="text-xs text-gray-400 font-medium">{client.address || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.company_name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.email || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{client.phone || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{client.projects}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {client.created_at ? new Date(client.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      client.status === 'Active' 
                        ? (darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') 
                        : (darkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className={`p-2 ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-300 hover:text-gray-600'} transition-colors`}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddClientModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={editingClient}
      />
    </div>
  );
}
