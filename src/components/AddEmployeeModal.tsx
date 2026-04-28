import React, { useState, useEffect, useRef } from 'react';
import { X, User, Briefcase, Mail, Phone, MapPin, Star, Clock, Camera, Upload, Trash2, Building2, Calendar, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface Employee {
  id: string;
  name: string;
  role: string;
  designation: string;
  department: string;
  team: string;
  location: 'Remote' | 'Office' | 'Hybrid';
  officeLocation: string;
  address: string;
  shift: 'Day' | 'Night' | 'Evening';
  email: string;
  phone: string;
  experience: string;
  status: 'Active' | 'Inactive' | 'Archived';
  avatar: string;
  joinDate: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employeeToEdit?: Employee | null;
}

const shifts = ['Day', 'Night', 'Evening'];
const locations = ['Remote', 'Office', 'Hybrid'];
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

export default function AddEmployeeModal({ isOpen, onClose, onSave, employeeToEdit }: AddEmployeeModalProps) {
  const { darkMode } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    designation: '',
    department: '',
    team: '',
    location: 'Office',
    officeLocation: '',
    address: '',
    shift: 'Day',
    email: '',
    phone: '',
    experience: '1 year',
    status: 'Active',
    avatar: DEFAULT_AVATAR,
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData(employeeToEdit);
    } else {
      setFormData({
        name: '',
        role: '',
        designation: '',
        department: '',
        team: '',
        location: 'Office',
        officeLocation: '',
        address: '',
        shift: 'Day',
        email: '',
        phone: '',
        experience: '1 year',
        status: 'Active',
        avatar: DEFAULT_AVATAR,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, avatar: DEFAULT_AVATAR });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeData: Employee = {
      id: formData.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name || '',
      role: formData.role || '',
      designation: formData.designation || '',
      department: formData.department || '',
      team: formData.team || '',
      location: (formData.location as Employee['location']) || 'Office',
      officeLocation: formData.officeLocation || '',
      address: formData.address || '',
      shift: (formData.shift as Employee['shift']) || 'Day',
      email: formData.email || '',
      phone: formData.phone || '',
      experience: formData.experience || '1 year',
      status: (formData.status as Employee['status']) || 'Active',
      avatar: formData.avatar || DEFAULT_AVATAR,
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0]
    };
    onSave(employeeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl transition-all duration-300 transform scale-100 ${darkMode ? 'bg-black' : 'bg-white dark:bg-black'}`}>
        <div className={`sticky top-0 z-10 flex justify-between items-center p-8 border-b ${darkMode ? 'border-gray-700 bg-black backdrop-blur-md' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-black/90 backdrop-blur-md'}`}>
          <div>
            <h2 className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
              {employeeToEdit ? 'Refine Profile' : 'New Talent'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Personnel Management System</p>
          </div>
          <button onClick={onClose} className={`p-3 rounded-2xl transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* Profile Image Section */}
          <div className={`flex flex-col items-center justify-center p-12 rounded-[3rem] border-2 border-dashed transition-all ${darkMode ? 'bg-black border-gray-700' : 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 shadow-inner'}`}>
            <div className="relative group shrink-0">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-44 h-44 rounded-[2.5rem] overflow-hidden border-8 border-white dark:border-gray-800 shadow-2xl">
                <img src={formData.avatar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Profile" />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white gap-2"
                >
                  <Upload size={32} />
                  <span className="text-xs font-black uppercase tracking-widest">Update Photo</span>
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <button 
                type="button"
                onClick={handleRemoveImage}
                className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10' : 'bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/5'}`}
              >
                <Trash2 size={14} /> Remove Photo
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Primary Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-blue-600'}`} placeholder="e.g. Sanchayan Dutta" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Work Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="email" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-blue-600'}`} placeholder="work@company.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-blue-600'}`} placeholder="+1 (555) 000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Join Date</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="date" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-blue-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-blue-600'}`} value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Job Role</label>
                <div className="relative">
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-purple-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-purple-600'}`} placeholder="e.g. Lead Designer" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Designation / Title</label>
                <div className="relative">
                  <Star size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-purple-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-purple-600'}`} placeholder="e.g. Senior Creative Lead" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Department</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input required type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-purple-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-purple-600'}`} placeholder="e.g. Engineering" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Experience</label>
                <div className="relative">
                  <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${darkMode ? 'bg-black border-gray-700 text-white' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white'}`} value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})}>
                    {['1 year', '2 years', '3 years', '4 years', '5+ years', '10+ years'].map(exp => <option key={exp} value={exp}>{exp}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Shift</label>
                <div className="relative">
                  <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${darkMode ? 'bg-black border-gray-700 text-white' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white'}`} value={formData.shift} onChange={(e) => setFormData({...formData, shift: e.target.value as Employee['shift']})}>
                    {shifts.map(s => <option key={s} value={s}>{s} Shift</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Work Environment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Work Location Type</label>
                <div className="flex gap-4">
                  {locations.map(loc => (
                    <button 
                      key={loc}
                      type="button"
                      onClick={() => setFormData({...formData, location: loc as Employee['location']})}
                      className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${formData.location === loc ? 'bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' : (darkMode ? 'bg-black border-gray-700 text-gray-400' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-400 hover:border-emerald-200')}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Office Branch / Place</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${darkMode ? 'bg-black border-gray-700 text-white focus:border-emerald-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-emerald-600'}`} placeholder="e.g. Headquarters, NY" value={formData.officeLocation} onChange={(e) => setFormData({...formData, officeLocation: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Residential / Full Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-4 top-4 text-gray-400" />
                <textarea 
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all min-h-[120px] font-medium ${darkMode ? 'bg-black border-gray-700 text-white focus:border-emerald-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-emerald-600'}`}
                  placeholder="Enter full physical address details..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <button type="button" onClick={onClose} className={`flex-1 py-5 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-200'}`}>Discard Changes</button>
            <button type="submit" className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:-translate-y-1 transition-all active:translate-y-0">
              {employeeToEdit ? 'Save Employee Profile' : 'Onboard New Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}





