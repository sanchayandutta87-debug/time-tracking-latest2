import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, FileText, Flag, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Task {
  id: string;
  project: string;
  task: string;
  createdOn: string;
  totalHours: string;
  priority: string;
  assignee: string;
  avatar: string;
  status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  taskToEdit?: Task | null;
}

const priorities = ['High', 'Medium', 'Low'];
const statuses = ['Active', 'On Hold', 'Completed', 'Archived'];

export default function AddTaskModal({ isOpen, onClose, onSave, taskToEdit }: AddTaskModalProps) {
  const { darkMode } = useAppContext();
  const [formData, setFormData] = useState<Partial<Task>>({
    project: '',
    task: '',
    priority: 'Low',
    assignee: '',
    totalHours: '0h 00m',
    status: 'Active'
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
    } else {
      setFormData({
        project: '',
        task: '',
        priority: 'Low',
        assignee: '',
        totalHours: '0h 00m',
        status: 'Active'
      });
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData: Task = {
      id: formData.id || `#TA${Math.floor(23000 + Math.random() * 1000)}`,
      project: formData.project || 'General',
      task: formData.task || 'New Task',
      createdOn: formData.createdOn || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalHours: formData.totalHours || '0h 00m',
      priority: formData.priority || 'Low',
      assignee: formData.assignee || 'Unassigned',
      avatar: formData.avatar || `https://picsum.photos/seed/${formData.assignee || 'user'}/40/40`,
      status: (formData.status as Task['status']) || 'Active'
    };
    onSave(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform scale-100 ${darkMode ? 'bg-black' : 'bg-white dark:bg-black'}`}>
        <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700 bg-black' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black/50'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Project</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="text" 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                  placeholder="e.g. Office Management"
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Task Name</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="text" 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                  placeholder="e.g. Update UI Modules"
                  value={formData.task}
                  onChange={(e) => setFormData({...formData, task: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Assignee</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  required
                  type="text" 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                  placeholder="e.g. Jenny Ellis"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Hours</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                  placeholder="e.g. 22h 30m"
                  value={formData.totalHours}
                  onChange={(e) => setFormData({...formData, totalHours: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Priority</label>
              <div className="relative">
                <Flag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 appearance-none ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Status</label>
              <select 
                className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 appearance-none ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-500' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:border-blue-500'}`}
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as Task['status']})}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all transform active:scale-95"
            >
              {taskToEdit ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
