import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, ChevronRight, MoreVertical, List, Grid, 
  ArrowUpDown, TrendingUp, TrendingDown, Loader2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';
import AddTeamModal from './AddTeamModal';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  lead: string;
  leadAvatar: string;
  members: number;
  performance: number;
  trend: 'up' | 'down';
  hours: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export default function TeamsView() {
  const { darkMode } = useAppContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch all teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*');

      if (teamsError) throw teamsError;

      // 2. Fetch all team_members to count members per team
      const { data: members, error: memberError } = await supabase
        .from('team_members')
        .select('team_id');

      if (memberError) throw memberError;

      // 3. Format data
      const teamMemberCounts = (members || []).reduce((acc: any, m) => {
        acc[m.team_id] = (acc[m.team_id] || 0) + 1;
        return acc;
      }, {});

      const formattedTeams: Team[] = (teamsData || []).map(t => {
        return {
          id: t.id,
          name: t.name,
          shortName: t.short_name || t.name.substring(0, 2).toUpperCase(),
          color: t.color || 'bg-blue-50 text-blue-600',
          lead: t.lead_name || 'No Lead',
          leadAvatar: t.lead_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.lead_name || 'Lead')}&background=random`,
          members: teamMemberCounts[t.id] || 0,
          performance: t.performance || 0,
          trend: t.trend || 'up',
          hours: t.total_hours || '0h 00m',
          createdDate: t.created_at ? new Date(t.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          status: t.status || 'Active'
        };
      });

      setTeams(formattedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();

    const subscription = supabase
      .channel('public:teams')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, () => {
        fetchTeams();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSaveTeam = async (teamData: any) => {
    try {
      const dbData = {
        name: teamData.name,
        short_name: teamData.short_name,
        color: teamData.color,
        lead_name: teamData.lead_name,
        lead_avatar: teamData.lead_avatar,
        performance: teamData.performance,
        trend: teamData.trend,
        total_hours: teamData.total_hours,
        status: teamData.status,
        description: teamData.description,
        manager_id: teamData.manager_id
      };

      let teamId = editingTeam?.id;

      if (editingTeam) {
        const { error } = await supabase
          .from('teams')
          .update(dbData)
          .eq('id', editingTeam.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('teams')
          .insert([dbData])
          .select();
        if (error) throw error;
        if (data && data[0]) teamId = data[0].id;
      }

      // Update team_members assignments
      if (teamId) {
        // 1. Clear existing members (only if editing)
        if (editingTeam) {
          await supabase
            .from('team_members')
            .delete()
            .eq('team_id', teamId);
        }

        // 2. Insert new members
        if (teamData.selectedMemberIds && teamData.selectedMemberIds.length > 0) {
          const assignments = teamData.selectedMemberIds.map((uid: string) => ({
            team_id: teamId,
            user_id: uid
          }));
          const { error: assignError } = await supabase
            .from('team_members')
            .insert(assignments);
          if (assignError) throw assignError;
        }
      }

      setIsModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team: ' + (error as any).message);
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`p-8 min-h-full transition-colors duration-500 ${darkMode ? 'bg-transparent text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Teams</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Teams</span>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
        <div className={`${darkMode ? 'bg-[#0A0A0B]/60 border-white/5' : 'bg-white border-gray-200'} flex items-center gap-2 border rounded-lg px-3 py-2.5 w-full lg:w-80 shadow-sm transition-all`}>
          <Search className="text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            className="outline-none w-full text-sm bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button className={`${darkMode ? 'bg-[#0A0A0B]/60 border-white/5 text-gray-300 hover:bg-white/5' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'} border px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all`}>
            <ArrowUpDown size={16} /> Sort By : Newest
          </button>
          
          <button 
            onClick={() => {
              setEditingTeam(null);
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
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={32} className="text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-500">Syncing team records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-50 bg-gray-50/50'}`}>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Team Name</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Team Lead</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Members</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Performance</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Total Worked Hours</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Created Date</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Status</th>
                  <th className={`px-6 py-4 text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-50'}`}>
                {filteredTeams.length > 0 ? filteredTeams.map((team) => (
                  <tr key={team.id} className={`hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.02] transition-colors group`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${darkMode ? 'bg-white/5 text-blue-400' : team.color}`}>
                          {team.shortName}
                        </div>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{team.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={team.leadAvatar} 
                          alt={team.lead} 
                          className={`w-8 h-8 rounded-full object-cover ${darkMode ? 'ring-1 ring-white/10' : ''}`}
                          referrerPolicy="no-referrer"
                        />
                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{team.lead}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={`text-sm font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{team.members} Members</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs font-bold ${team.trend === 'up' ? 'bg-emerald-500/90' : 'bg-rose-500/90'}`}>
                        {team.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {team.performance}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{team.hours}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{team.createdDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                        team.status === 'Active' 
                          ? (darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100') 
                          : (darkMode ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100')
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setEditingTeam(team);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-gray-400">No teams found. Click "Add New" to create one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTeamModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTeam}
        teamToEdit={editingTeam as any}
      />
    </div>
  );
}
