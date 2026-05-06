import React, { useState, useEffect } from 'react';
import { X, Users, Briefcase, Award, FileText, ClipboardList } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string;
  lead: string;
  leadAvatar: string;
  members: number;
  memberNames: string[];
  tasks: string[];
  description: string;
  performance: number;
  trend: 'up' | 'down';
  hours: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (team: any) => void;
  teamToEdit?: Team | null;
}

const COLORS = [
  'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
  'bg-red-50 dark:bg-red-900/20 text-red-600',
  'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
  'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
  'bg-purple-50 text-purple-600',
  'bg-pink-50 text-pink-600',
];

export default function AddTeamModal({ isOpen, onClose, onSave, teamToEdit }: AddTeamModalProps) {
  const { darkMode } = useAppContext();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>(teamToEdit?.lead || '');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: teamToEdit?.name || '',
    color: teamToEdit?.color || COLORS[0],
    status: teamToEdit?.status || 'Active',
    description: teamToEdit?.description || '',
    tasks: teamToEdit?.tasks?.join(', ') || ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchAllUsers();
      if (teamToEdit) {
        // Find user by lead name if it's not a UUID
        // But better to store manager_id directly
      }
    }
  }, [isOpen]);

  const fetchAllUsers = async () => {
    const { data } = await supabase.from('users').select('id, full_name, avatar_url');
    setAllUsers(data || []);
  };

  const toggleMember = (id: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const shortName = formData.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'TM';
      const tasksArr = formData.tasks.split(',').map(t => t.trim()).filter(t => t !== '');
      
      const selectedManager = allUsers.find(u => u.id === selectedManagerId);

      const teamForDb = {
        id: teamToEdit?.id,
        name: formData.name,
        short_name: shortName,
        color: formData.color,
        lead_name: selectedManager?.full_name || 'No Lead',
        lead_avatar: selectedManager?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedManager?.full_name || 'Lead')}&background=random`,
        performance: teamToEdit?.performance || Math.floor(Math.random() * 40) + 60,
        trend: teamToEdit ? teamToEdit.trend : (Math.random() > 0.5 ? 'up' : 'down'),
        total_hours: teamToEdit?.hours || '0h 00m',
        status: formData.status,
        description: formData.description,
        manager_id: selectedManagerId || null
      };

      await onSave({
        ...teamForDb,
        selectedMemberIds
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ${darkMode ? 'bg-black border border-gray-800' : 'bg-white dark:bg-black'}`}>
        
        {/* Header */}
        <div className={`px-8 py-6 flex items-center justify-between border-b ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black'}`}>
          <div>
            <h2 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {teamToEdit ? 'Edit Team details' : 'Create New Team'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Workspace Configuration</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${darkMode ? 'text-gray-400 hover:bg-black hover:text-white' : 'text-gray-400 hover:bg-100 hover:text-gray-900 dark:text-white'}`}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="team-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Name *</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <Briefcase size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                  <input 
                    type="text" 
                    required 
                    className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="e.g. Mobile Development"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Lead / Manager *</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <Award size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                  <select 
                    required
                    className={`bg-transparent outline-none w-full text-sm font-bold appearance-none cursor-pointer ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    value={selectedManagerId}
                    onChange={e => setSelectedManagerId(e.target.value)}
                  >
                    <option value="" className={darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}>Select a Lead</option>
                    {allUsers.map(user => (
                      <option 
                        key={user.id} 
                        value={user.id} 
                        className={darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}
                      >
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Description</label>
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <FileText size={16} className={`mt-1 ${darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'}`} />
                  <textarea 
                    rows={3}
                    className={`bg-transparent outline-none w-full text-sm font-bold resize-none ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="What does this team do?"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Members</label>
                <div className={`space-y-2 max-h-40 overflow-y-auto p-3 rounded-xl border ${darkMode ? 'bg-black border-gray-700' : 'bg-white border-gray-200'} custom-scrollbar`}>
                  {allUsers.length > 0 ? (
                    allUsers.map(user => (
                      <label key={user.id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedMemberIds.includes(user.id) ? (darkMode ? 'bg-blue-600/20' : 'bg-blue-50') : (darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50')}`}>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedMemberIds.includes(user.id)}
                          onChange={() => toggleMember(user.id)}
                        />
                        <div className="flex items-center gap-2">
                          <img 
                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{user.full_name}</span>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4 italic">No employees found to add.</p>
                  )}
                </div>
                <p className="mt-2 text-[10px] text-gray-400 font-medium italic">Selected: {selectedMemberIds.length} members</p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Tasks (Comma separated)</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <ClipboardList size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                  <input 
                    type="text" 
                    className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="Design UI, API Integration, Testing..."
                    value={formData.tasks}
                    onChange={e => setFormData({...formData, tasks: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${color} ${formData.color === color ? (darkMode ? 'border-gray-500 scale-110 shadow-lg' : 'border-gray-400 scale-110 shadow-lg') : 'border-transparent hover:scale-105'}`}
                    >
                      {formData.name ? formData.name.substring(0, 1).toUpperCase() : 'T'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Status</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Active', 'Inactive'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({...formData, status})}
                      className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                        formData.status === status 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                          : `${darkMode ? 'border-gray-700 bg-black text-gray-400 hover:bg-black' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-900'}`
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t flex justify-end gap-3 ${darkMode ? 'bg-black border-gray-800' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800'}`}>
          <button 
            type="button" 
            onClick={onClose} 
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${darkMode ? 'text-gray-400 hover:bg-black hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:text-white'}`}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="team-form"
            disabled={isSaving}
            className={`bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Processing...' : (teamToEdit ? 'Save Changes' : 'Create Team')}
          </button>
        </div>
      </div>
    </div>
  );
}
