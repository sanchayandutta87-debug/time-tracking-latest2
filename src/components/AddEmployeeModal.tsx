import React, { useState, useEffect, useRef } from 'react';
import { X, User, Briefcase, Mail, Phone, MapPin, Star, Clock, Building2, Calendar } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

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
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

export default function AddEmployeeModal({ isOpen, onClose, onSave, employeeToEdit }: AddEmployeeModalProps) {
  const { darkMode } = useAppContext();
  
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    role: '',
    designation: '',
    department: '',
    team: '',
    address: '',
    shift: 'Day',
    email: '',
    phone: '',
    status: 'Active',
    avatar: DEFAULT_AVATAR,
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [filteredDesignations, setFilteredDesignations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: deptData } = await supabase.from('departments').select('*').order('name');
        setDepartments(deptData || []);

        // We'll also fetch all designations if the table exists
        const { data: desigData } = await supabase.from('designations').select('*').order('name');
        setDesignations(desigData || []);
      } catch (err) {
        console.error('Error fetching modal data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (formData.department) {
      const filtered = designations.filter(d => d.department_name === formData.department || d.department_id === departments.find(dept => dept.name === formData.department)?.id);
      setFilteredDesignations(filtered);
    } else {
      setFilteredDesignations([]);
    }
  }, [formData.department, designations, departments]);

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
        address: '',
        shift: 'Day',
        email: '',
        phone: '',
        status: 'Active',
        avatar: DEFAULT_AVATAR,
        joinDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const employeeData: Employee = {
      id: formData.id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name || '',
      role: formData.role || '',
      designation: formData.designation || '',
      department: formData.department || '',
      team: formData.team || '',
      address: formData.address || '',
      shift: (formData.shift as Employee['shift']) || 'Day',
      email: formData.email || '',
      phone: formData.phone || '',
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
                  <select 
                    required 
                    className={`w-full pl-12 pr-10 py-4 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${darkMode ? 'bg-black border-gray-700 text-white focus:border-purple-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-purple-600'}`}
                    value={formData.designation} 
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  >
                    <option value="">Select Designation</option>
                    {filteredDesignations.length > 0 ? (
                      filteredDesignations.map(d => <option key={d.id} value={d.name}>{d.name}</option>)
                    ) : (
                      <option value="" disabled>{formData.department ? 'No roles found for this dept' : 'Select a department first'}</option>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>Department</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select 
                    required 
                    className={`w-full pl-12 pr-10 py-4 rounded-2xl border-2 outline-none transition-all font-bold appearance-none ${darkMode ? 'bg-black border-gray-700 text-white focus:border-purple-600' : 'bg-white dark:bg-black border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:border-purple-600'}`}
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value, designation: ''})}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
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
            <h3 className={`text-xs font-black uppercase tracking-[0.3em] ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Additional Details</h3>
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





