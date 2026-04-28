import React, { useState } from 'react';
import { X, Users, Briefcase, Award, FileText, ClipboardList } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
  onSave: (team: Team) => void;
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
  const [formData, setFormData] = useState({
    name: teamToEdit?.name || '',
    lead: teamToEdit?.lead || '',
    color: teamToEdit?.color || COLORS[0],
    status: teamToEdit?.status || 'Active',
    description: teamToEdit?.description || '',
    memberNames: teamToEdit?.memberNames?.join(', ') || '',
    tasks: teamToEdit?.tasks?.join(', ') || ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortName = formData.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'TM';
    const memberNamesArr = formData.memberNames.split(',').map(n => n.trim()).filter(n => n !== '');
    const tasksArr = formData.tasks.split(',').map(t => t.trim()).filter(t => t !== '');
    
    const newTeam: Team = {
      id: teamToEdit?.id || `TEAM-${Date.now()}`,
      name: formData.name,
      shortName,
      color: formData.color,
      lead: formData.lead,
      leadAvatar: teamToEdit?.leadAvatar || `https://picsum.photos/seed/${formData.lead.replace(/\s/g, '') || 'lead'}/40/40`,
      members: memberNamesArr.length || teamToEdit?.members || Math.floor(Math.random() * 10) + 2,
      memberNames: memberNamesArr,
      tasks: tasksArr,
      description: formData.description,
      performance: teamToEdit?.performance || Math.floor(Math.random() * 40) + 60,
      trend: teamToEdit ? teamToEdit.trend : (Math.random() > 0.5 ? 'up' : 'down'),
      hours: teamToEdit?.hours || '0h 00m',
      createdDate: teamToEdit?.createdDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: formData.status as 'Active' | 'Inactive'
    };

    onSave(newTeam);
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
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Lead *</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <Award size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                  <input 
                    type="text" 
                    required 
                    className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="Manager or Lead Name"
                    value={formData.lead}
                    onChange={e => setFormData({...formData, lead: e.target.value})}
                  />
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
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Team Members (Comma separated)</label>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500/20 transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700'}`}>
                  <Users size={16} className={darkMode ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'} />
                  <input 
                    type="text" 
                    className={`bg-transparent outline-none w-full text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900 dark:text-white'}`} 
                    placeholder="Alice, Bob, Charlie..."
                    value={formData.memberNames}
                    onChange={e => setFormData({...formData, memberNames: e.target.value})}
                  />
                </div>
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
            className="bg-blue-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            {teamToEdit ? 'Save Changes' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
}
