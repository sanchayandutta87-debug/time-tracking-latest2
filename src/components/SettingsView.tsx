import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Building2, Briefcase, 
  Settings as SettingsIcon, Trash2, Camera, 
  ChevronRight, Globe, CheckCircle2,
  ChevronDown, Users,
  Zap, Target, Wand2, Eye, EyeOff, Clock, X, Loader2, Calendar
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../context/AppContext';

type SettingsTab = 'company' | 'work' | 'system';
type AccountSubTab = 'profile' | 'security';

const COUNTRIES = [
  { code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷' },
];

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [activeSubTab, setActiveSubTab] = useState<string>('organization');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast, askConfirm } = useAppContext();

  const fetchWithTimeout = async (promise: Promise<any>, timeoutMs: number = 15000) => {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timed out. Please check your Supabase connection and keys.')), timeoutMs)
    );
    return Promise.race([promise, timeout]);
  };

  // Profile State
  const [profileData, setProfileData] = useState({
    firstName: 'Shaun',
    lastName: 'Farley',
    email: 'shaun.farley@example.com',
    countryCode: '+1',
    phone: '(555) 000-0000',
    address: 'Bamangacchi',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  });
  const [profileImage, setProfileImage] = useState('https://picsum.photos/seed/profile/120/120');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Security State
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Company State
  const [companyData, setCompanyData] = useState({
    name: '',
    owner_name: '',
    email: '',
    countryCode: '+1',
    phone: '',
    industry: '',
    teamSize: '',
    address: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    taxId: '',
    timezone: '',
    currency: '',
    website: ''
  });
  const [companyLogo, setCompanyLogo] = useState('');
  const companyFileInputRef = React.useRef<HTMLInputElement>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', head: '', budget: '' });

  const [isDesigModalOpen, setIsDesigModalOpen] = useState(false);
  const [selectedDeptForDesig, setSelectedDeptForDesig] = useState<any>(null);
  const [newDesigName, setNewDesigName] = useState('');


  // Employee Types State
  const [employeeTypes, setEmployeeTypes] = useState<any[]>([]);
  const [isLoadingEmployeeTypes, setIsLoadingEmployeeTypes] = useState(false);

  // Modal States
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  const [newType, setNewType] = useState({ type: '', color: 'bg-blue-500/10 text-blue-600' });
  const [newShift, setNewShift] = useState({ name: '', time: '', color: 'bg-blue-100 text-blue-600' });
  
  // Work Settings State
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeaveName, setNewLeaveName] = useState('');
  const [shifts, setShifts] = useState<any[]>([]);
  const [workingHours, setWorkingHours] = useState([
    { day: 'Monday', start: '09:00', end: '18:00', active: true },
    { day: 'Tuesday', start: '09:00', end: '18:00', active: true },
    { day: 'Wednesday', start: '09:00', end: '18:00', active: true },
    { day: 'Thursday', start: '09:00', end: '18:00', active: true },
    { day: 'Friday', start: '09:00', end: '18:00', active: true },
    { day: 'Saturday', start: '09:00', end: '13:00', active: false },
    { day: 'Sunday', start: '09:00', end: '13:00', active: false }
  ]);
  const [trackerSettings, setTrackerSettings] = useState({
    lateComingTime: '15',
    dailyOvertimeLimit: '2',
    screenshots: true,
    screenshotInterval: '10',
    screenshotDelete: true,
    blurScreenshots: true,
    employeeEdit: true,
    workSchedule: true,
    websiteApplication: true
  });

  // System Settings State
  const [localization, setLocalization] = useState({
    timeZone: '(+5:30) GMT',
    startWeekOn: 'Monday',
    dateFormat: '18 Mar 2025',
    timeFormat: '12 hrs',
    language: 'English',
    currency: 'USD',
    currencySymbol: '$',
    currencyPosition: 'Before Amount',
    decimalSeparator: '.',
    thousandSeparator: ','
  });

  const isFetchingRef = useRef<{ [key: string]: boolean }>({});

  // Fetch Company Settings
  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setCompanyData({
          name: data.name || '',
          owner_name: data.owner_name || '',
          email: data.email || '',
          countryCode: '+1', // Simplified
          phone: data.phone || '',
          industry: data.industry || '',
          teamSize: data.team_size || '',
          address: data.address || '',
          country: data.country || '',
          state: data.state || '',
          city: data.city || '',
          postalCode: data.postal_code || '',
          taxId: data.tax_id || '',
          timezone: data.timezone || '',
          currency: data.currency || '',
          website: data.website || ''
        });
        setCompanyLogo(data.logo_url || '');
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  const fetchDepartments = async () => {
    if (isFetchingRef.current['departments']) return;
    isFetchingRef.current['departments'] = true;
    setIsLoadingDepartments(true);
    try {
      const { data: deptData, error: deptError } = await fetchWithTimeout(supabase.from('departments').select('*').order('name')) as any;
      if (deptError) throw deptError;
      setDepartments(deptData || []);

      const { data: desigData, error: desigError } = await fetchWithTimeout(supabase.from('designations').select('*').order('name')) as any;
      if (!desigError) setDesignations(desigData || []);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      showToast(error.message || 'Failed to fetch departments', 'error');
    } finally {
      setIsLoadingDepartments(false);
      isFetchingRef.current['departments'] = false;
    }
  };

  const fetchEmployeeTypes = async () => {
    if (isFetchingRef.current['employeeTypes']) return;
    isFetchingRef.current['employeeTypes'] = true;
    setIsLoadingEmployeeTypes(true);
    try {
      const { data, error } = await fetchWithTimeout(supabase.from('employee_types').select('*').order('type')) as any;
      if (error) throw error;
      setEmployeeTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching employee types:', error);
      showToast(error.message || 'Failed to fetch employee types', 'error');
    } finally {
      setIsLoadingEmployeeTypes(false);
      isFetchingRef.current['employeeTypes'] = false;
    }
  };

  const fetchLeaveTypes = async () => {
    if (isFetchingRef.current['leaveTypes']) return;
    isFetchingRef.current['leaveTypes'] = true;
    setIsLoadingLeaves(true);
    try {
      const { data, error } = await fetchWithTimeout(supabase.from('leave_types').select('*').order('name')) as any;
      if (error) throw error;
      setLeaveTypes(data || []);
    } catch (error: any) {
      console.error('Error fetching leave types:', error);
      showToast(error.message || 'Failed to fetch leave types', 'error');
    } finally {
      setIsLoadingLeaves(false);
      isFetchingRef.current['leaveTypes'] = false;
    }
  };

  const fetchWorkSettings = async () => {
    if (isFetchingRef.current['workSettings']) return;
    isFetchingRef.current['workSettings'] = true;
    try {
      const { data, error } = await fetchWithTimeout(supabase.from('work_settings').select('*')) as any;
      if (error) throw error;
      if (data && data.length > 0) {
        const settings = data[0];
        setWorkingHours(settings.working_hours || workingHours);
        setTrackerSettings(settings.tracker_settings || trackerSettings);
      }
    } catch (error) {
      console.error('Error fetching work settings:', error);
    } finally {
      isFetchingRef.current['workSettings'] = false;
    }
  };

  const handleSaveWorkSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('work_settings').upsert({
        id: '00000000-0000-0000-0000-000000000000',
        working_hours: workingHours,
        tracker_settings: trackerSettings
      });
      if (error) throw error;
      showToast('Work settings saved successfully');
    } catch (error: any) {
      console.error('Error saving work settings:', error);
      showToast(error.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDept.name) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('departments').insert({
        name: newDept.name,
        head: newDept.head,
        budget: newDept.budget,
        members_count: 0
      });
      if (error) throw error;
      fetchDepartments();
      setIsDeptModalOpen(false);
      setNewDept({ name: '', head: '', budget: '' });
      showToast('Department added successfully');
    } catch (error: any) {
      console.error('Error adding department:', error);
      showToast(error.message || 'Failed to add department', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    askConfirm('Delete Department', 'Are you sure you want to remove this department? This cannot be undone.', async () => {
      try {
        const { error } = await supabase.from('departments').delete().eq('id', id);
        if (error) throw error;
        fetchDepartments();
        showToast('Department deleted successfully');
      } catch (error) {
        console.error('Error deleting department:', error);
        showToast('Failed to delete department', 'error');
      }
    });
  };


  const handleAddEmployeeType = async () => {
    if (!newType.type.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('employee_types').insert({ 
        type: newType.type.trim(), 
        color: newType.color 
      });
      if (error) throw error;
      await fetchEmployeeTypes();
      setIsTypeModalOpen(false);
      setNewType({ type: '', color: 'bg-blue-500/10 text-blue-600' });
      showToast('Employee type added successfully', 'success');
    } catch (error: any) {
      console.error('Error adding employee type:', error);
      showToast(error.message || 'Failed to add employee type', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEmployeeType = async (id: string) => {
    askConfirm('Delete Employee Type', 'Are you sure you want to remove this employee category?', async () => {
      try {
        const { error } = await supabase.from('employee_types').delete().eq('id', id);
        if (error) throw error;
        fetchEmployeeTypes();
        showToast('Employee type removed');
      } catch (error) {
        console.error('Error deleting employee type:', error);
        showToast('Failed to delete employee type', 'error');
      }
    });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleAddDesignation = async () => {
    if (!newDesigName.trim() || !selectedDeptForDesig) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('designations').insert({
        name: newDesigName.trim(),
        department_id: selectedDeptForDesig.id,
        department_name: selectedDeptForDesig.name
      }).select().single();

      if (error) throw error;
      setDesignations(prev => [...(prev || []), data]);
      setNewDesigName('');
      setIsDesigModalOpen(false);
      showToast('Designation added successfully', 'success');
    } catch (error: any) {
      console.error('Error adding designation:', error);
      showToast(error.message || 'Failed to add designation', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDesignation = async (id: string) => {
    try {
      const { error } = await supabase.from('designations').delete().eq('id', id);
      if (error) throw error;
      setDesignations(prev => (prev || []).filter(d => d.id !== id));
      showToast('Designation removed', 'success');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleResetCompany = () => {
    fetchCompanySettings();
  };
  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCompanyLogo(url);
    }
  };

  const handleRemoveCompanyLogo = () => {
    setCompanyLogo(`https://ui-avatars.com/api/?name=${companyData.name}&background=random`);
  };

  // Appearance State
  const [theme, setTheme] = useState('Light');
  const [accentColor, setAccentColor] = useState('blue');
  const [sidebarSize, setSidebarSize] = useState('Default');
  const [fontFamily, setFontFamily] = useState('Inter');

  const handleCancel = () => {
    setTheme('Light');
    setAccentColor('blue');
    setSidebarSize('Default');
    setFontFamily('Inter');
  };

  const getAccentClass = (type: 'bg' | 'hover' | 'text' | 'border' | 'ring') => {
    const colors: Record<string, any> = {
      blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', text: 'text-blue-600', border: 'border-blue-600', ring: 'ring-blue-500' },
      gray: { bg: 'bg-slate-700', hover: 'hover:bg-black', text: 'text-slate-700', border: 'border-slate-700', ring: 'ring-slate-500' },
      green: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', text: 'text-emerald-500', border: 'border-emerald-500', ring: 'ring-emerald-400' },
      red: { bg: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-500', border: 'border-red-500', ring: 'ring-red-400' },
      sky: { bg: 'bg-sky-500', hover: 'hover:bg-sky-600', text: 'text-sky-500', border: 'border-sky-500', ring: 'ring-sky-400' },
      orange: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-amber-500', border: 'border-amber-500', ring: 'ring-amber-400' }
    };
    return colors[accentColor][type];
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };



  const handleResetLocalization = () => {
    setLocalization({
      timeZone: '(+5:30) GMT',
      startWeekOn: 'Monday',
      dateFormat: '18 Mar 2025',
      timeFormat: '12 hrs',
      language: 'English',
      currency: 'USD',
      currencySymbol: '$',
      currencyPosition: 'Before Amount',
      decimalSeparator: '.',
      thousandSeparator: ','
    });
  };



  const sidebarItems = [
    { id: 'company', label: 'Company Settings', icon: <Building2 size={18} /> },
    { id: 'work', label: 'Work Settings', icon: <Briefcase size={18} /> },
    { id: 'system', label: 'System Settings', icon: <SettingsIcon size={18} /> },
  ];

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (tab === 'account') setActiveSubTab('profile');
    else if (tab === 'company') setActiveSubTab('organization');
    else if (tab === 'work') setActiveSubTab('leave-types');
    else if (tab === 'system') setActiveSubTab('localization');
  };

  const handleAddLeaveType = async () => {
    if (!newLeaveName.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('leave_types').insert({
        name: newLeaveName.trim(),
        status: 'active'
      });
      if (error) throw error;
      fetchLeaveTypes();
      setIsLeaveModalOpen(false);
      setNewLeaveName('');
      showToast('Leave type added successfully');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLeaveType = async (id: string) => {
    askConfirm('Delete Leave Type', 'Are you sure you want to remove this leave type?', async () => {
      try {
        const { error } = await supabase.from('leave_types').delete().eq('id', id);
        if (error) throw error;
        fetchLeaveTypes();
        showToast('Leave type deleted');
      } catch (error) {
        console.error('Error deleting leave type:', error);
        showToast('Failed to delete leave type', 'error');
      }
    });
  };

  const handleAddShift = async () => {
    if (!newShift.name || !newShift.time) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('shifts').insert({
        name: newShift.name,
        time: newShift.time,
        color: newShift.color,
        members: 0
      });
      if (error) throw error;
      setIsShiftModalOpen(false);
      setNewShift({ name: '', time: '', color: 'bg-blue-100 text-blue-600' });
      fetchWorkSettings();
      showToast('Shift added successfully');
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteShift = async (id: string) => {
    askConfirm('Delete Shift', 'Are you sure you want to remove this work shift?', async () => {
      try {
        const { error } = await supabase.from('shifts').delete().eq('id', id);
        if (error) throw error;
        fetchWorkSettings();
        showToast('Shift removed');
      } catch (error) {
        console.error('Error deleting shift:', error);
        showToast('Failed to delete shift', 'error');
      }
    });
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          id: '00000000-0000-0000-0000-000000000000',
          name: companyData.name,
          owner_name: companyData.owner_name,
          email: companyData.email,
          phone: companyData.phone,
          industry: companyData.industry,
          team_size: companyData.teamSize,
          address: companyData.address,
          country: companyData.country,
          state: companyData.state,
          city: companyData.city,
          postal_code: companyData.postalCode,
          tax_id: companyData.taxId,
          timezone: companyData.timezone,
          currency: companyData.currency,
          website: companyData.website,
          logo_url: companyLogo
        });

      if (error) throw error;
      showToast('Company settings saved successfully');
    } catch (error: any) {
      console.error('Error saving company settings:', error);
      showToast(error.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };


  // Load Initial Data
  useEffect(() => {
    fetchCompanySettings();
    fetchDepartments();
    fetchEmployeeTypes();
    fetchLeaveTypes();
    fetchWorkSettings();
  }, []);

  // Sync sub-tabs
  useEffect(() => {
    if (activeTab === 'company') {
      if (activeSubTab === 'organization') fetchCompanySettings();
      if (activeSubTab === 'departments') fetchDepartments();
      if (activeSubTab === 'employee-type') fetchEmployeeTypes();
    }
    if (activeTab === 'work') {
      if (activeSubTab === 'leave-types') fetchLeaveTypes();
      else fetchWorkSettings();
    }
  }, [activeTab, activeSubTab]);


  return (
    <div className="p-8 bg-white dark:bg-black min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600 dark:text-gray-400">Settings</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 border-blue-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:bg-black border-transparent'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

            {activeTab === 'company' && (
              <>
                {/* Company Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-gray-800">
                  {['Organization', 'Departments', 'Employee Type'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                      >
                        {tab}
                        {activeSubTab === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-8">
                  {activeSubTab === 'organization' ? (
                    <div className="space-y-8">
                      {/* Company Profile */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6">Company Profile</h3>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                          <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                              <img 
                                src={companyLogo || `https://ui-avatars.com/api/?name=${companyData.name}&background=random`} 
                                alt="Company Logo" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button 
                              onClick={() => companyFileInputRef.current?.click()}
                              className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all active:scale-90"
                            >
                              <Camera size={14} />
                            </button>
                            <input 
                              type="file" 
                              ref={companyFileInputRef}
                              onChange={handleCompanyLogoUpload}
                              className="hidden" 
                              accept="image/*"
                            />
                            {companyLogo && (
                              <button 
                                onClick={handleRemoveCompanyLogo}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={10} />
                              </button>
                            )}
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Company Name <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="name"
                                value={companyData.name}
                                onChange={handleCompanyChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Company Email <span className="text-red-500">*</span></label>
                              <input 
                                type="email" 
                                name="email"
                                value={companyData.email}
                                onChange={handleCompanyChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number <span className="text-red-500">*</span></label>
                              <div className="flex">
                                <select className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg text-sm focus:outline-none">
                                  {COUNTRIES.map(c => <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>)}
                                </select>
                                <input 
                                  type="text" 
                                  name="phone"
                                  value={companyData.phone}
                                  onChange={handleCompanyChange}
                                  className="flex-1 px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Business Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-6">Business Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Industry</label>
                            <div className="relative">
                              <select 
                                name="industry"
                                value={companyData.industry}
                                onChange={handleCompanyChange}
                                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              >
                                <option>Technology</option>
                                <option>Healthcare</option>
                                <option>Finance</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Team Size</label>
                            <div className="relative">
                              <select 
                                name="teamSize"
                                value={companyData.teamSize}
                                onChange={handleCompanyChange}
                                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              >
                                <option>51-200</option>
                                <option>1-10</option>
                                <option>11-50</option>
                                <option>200+</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Timezone & Currency */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Timezone & Currency</h3>
                        <p className="text-xs text-gray-400 mb-6">Set default regional settings for your organization</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Default Timezone</label>
                            <div className="relative">
                              <select 
                                name="timezone"
                                value={companyData.timezone}
                                onChange={handleCompanyChange}
                                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              >
                                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                <option>(GMT+00:00) London</option>
                                <option>(GMT+05:30) India</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Default Currency</label>
                            <div className="relative">
                              <select 
                                name="currency"
                                value={companyData.currency}
                                onChange={handleCompanyChange}
                                className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              >
                                <option>USD ($) - US Dollar</option>
                                <option>EUR (€) - Euro</option>
                                <option>GBP (£) - British Pound</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Social Profiles */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Social Profiles</h3>
                        <p className="text-xs text-gray-400 mb-6">Connect your organization's social media accounts</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">LinkedIn</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="linkedin.com/company/..."
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Website</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                name="website"
                                value={companyData.website}
                                onChange={handleCompanyChange}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Tax Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Tax Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Manage tax registration and identification numbers</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Tax ID / EIN</label>
                            <input 
                              type="text" 
                              name="taxId"
                              value={companyData.taxId}
                              onChange={handleCompanyChange}
                              placeholder="XX-XXXXXXX"
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">VAT Number (Optional)</label>
                            <input 
                              type="text" 
                              placeholder="Enter VAT number"
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Address Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Address Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your address details</p>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Address <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="address"
                              value={companyData.address}
                              onChange={handleCompanyChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Country <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="country"
                                value={companyData.country}
                                onChange={handleCompanyChange}
                                placeholder="Enter country"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">State <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="state"
                                value={companyData.state}
                                onChange={handleCompanyChange}
                                placeholder="Enter state"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">City <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="city"
                                value={companyData.city}
                                onChange={handleCompanyChange}
                                placeholder="Enter city"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Postal Code <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="postalCode"
                                value={companyData.postalCode}
                                onChange={handleCompanyChange}
                                placeholder="Enter postal code"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Transfer Ownership */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Transfer Ownership</h3>
                        <p className="text-xs text-gray-400 mb-6">You must select an existing admin to transfer ownership.</p>
                        <div className="flex gap-4 items-end max-w-2xl">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Owner Name</label>
                            <input 
                              type="text" 
                              name="owner_name"
                              value={companyData.owner_name}
                              onChange={handleCompanyChange}
                              placeholder="Enter owner name"
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </section>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                        <button 
                          onClick={handleResetCompany}
                          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveCompany}
                          disabled={isSaving}
                          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : activeSubTab === 'departments' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Departments</h3>
                          <p className="text-xs text-gray-400">Manage your organization's departments</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={fetchDepartments}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Refresh"
                          >
                            <Loader2 size={16} className={isLoadingDepartments ? 'animate-spin' : ''} />
                          </button>
                          <button 
                            onClick={() => {
                              console.log('Opening Dept Modal');
                              setIsDeptModalOpen(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                          >
                            Add Department
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {isLoadingDepartments ? (
                          <div className="col-span-full py-10 text-center text-gray-400">Loading departments...</div>
                        ) : departments.length > 0 ? departments.map((dept) => (
                          <div key={dept.id} className="p-5 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Briefcase size={20} />
                              </div>
                              <button 
                                onClick={() => handleDeleteDepartment(dept.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{dept.name}</h4>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Head</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{dept.head}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Members</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{dept.members_count}</span>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-50 dark:border-gray-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designations</span>
                                <button 
                                  onClick={() => {
                                    setSelectedDeptForDesig(dept);
                                    setIsDesigModalOpen(true);
                                  }}
                                  className="text-[10px] font-bold text-blue-600 hover:underline"
                                >
                                  + Add Role
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {(designations || []).filter(d => d.department_id === dept.id || d.department_name === dept.name).length > 0 ? (
                                  (designations || []).filter(d => d.department_id === dept.id || d.department_name === dept.name).map(desig => (
                                    <div key={desig.id} className="group/desig relative">
                                      <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[9px] font-bold rounded-md border border-gray-100 dark:border-gray-700">
                                        {desig.name}
                                      </span>
                                      <button 
                                        onClick={() => handleDeleteDesignation(desig.id)}
                                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/desig:opacity-100 transition-opacity text-[8px]"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-[9px] text-gray-400 italic">No roles defined</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="col-span-full py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                              <Briefcase size={32} />
                            </div>
                            <p className="text-gray-400 text-sm italic">No departments found. Add one to get started!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeSubTab === 'employee-type' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Employee Types</h3>
                          <p className="text-xs text-gray-400">Define employment categories for your team</p>
                        </div>
                        <button 
                          onClick={() => setIsTypeModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                          Add Type
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoadingEmployeeTypes ? (
                          <div className="col-span-full py-10 text-center text-gray-400">Loading types...</div>
                        ) : employeeTypes.map((item) => (
                          <div key={item.id} className="p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${item.color || 'bg-gray-100 text-gray-600'} rounded-lg flex items-center justify-center`}>
                                <Users size={16} />
                              </div>
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.type}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.count} members</span>
                              <button 
                                onClick={() => handleDeleteEmployeeType(item.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Building2 size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'work' && (
              <>
                {/* Work Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-gray-800">
                  {['Leave Types', 'Shift', 'Working Hours', 'Tracker Settings'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                      >
                        {tab}
                        {activeSubTab === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-8">
                  {activeSubTab === 'leave-types' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Leave Type</h3>
                        <div className="flex gap-3">
                          <button 
                            onClick={handleSaveWorkSettings}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                          >
                            <Wand2 size={14} />
                            Leave type
                          </button>
                          <button 
                            onClick={() => setIsLeaveModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            + Add New
                          </button>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Leave Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Created Date</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {isLoadingLeaves ? (
                              <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">Loading...</td>
                              </tr>
                            ) : leaveTypes.length > 0 ? leaveTypes.map((item) => (
                              <tr key={item.id} className="hover:bg-white dark:bg-black transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">{item.name}</td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                  {new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-bold uppercase">
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => handleDeleteLeaveType(item.id)}
                                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No leave types found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Leave Type Modal */}
                      {isLeaveModalOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                              <h3 className="font-bold text-gray-800 dark:text-white">Add New Leave Type</h3>
                              <button onClick={() => setIsLeaveModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                              </button>
                            </div>
                            <div className="p-6 space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Leave Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. ABC Leave"
                                  value={newLeaveName}
                                  onChange={(e) => setNewLeaveName(e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                />
                              </div>
                              <div className="flex gap-3 pt-2">
                                <button 
                                  onClick={() => setIsLeaveModalOpen(false)}
                                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={handleAddLeaveType}
                                  disabled={isSaving}
                                  className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                  {isSaving ? 'Creating...' : 'Create Type'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeSubTab === 'shift' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Work Shifts</h3>
                          <p className="text-xs text-gray-400">Manage your organization's work shifts and timings</p>
                        </div>
                        <button 
                          onClick={() => setIsShiftModalOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          + Add Shift
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {shifts.map((shift) => (
                          <div key={shift.id} className="p-5 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-10 h-10 ${shift.color} rounded-lg flex items-center justify-center`}>
                                <Clock size={20} />
                              </div>
                              <button 
                                onClick={() => handleDeleteShift(shift.id)}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{shift.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{shift.time}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Members</span>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{shift.members}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Shift Modal */}
                      {isShiftModalOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                              <h3 className="font-bold text-gray-800 dark:text-white">Add New Work Shift</h3>
                              <button onClick={() => setIsShiftModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                              </button>
                            </div>
                            <div className="p-6 space-y-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shift Name</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Night Shift"
                                  value={newShift.name}
                                  onChange={(e) => setNewShift({...newShift, name: e.target.value})}
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time Range</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. 10:00 PM - 06:00 AM"
                                  value={newShift.time}
                                  onChange={(e) => setNewShift({...newShift, time: e.target.value})}
                                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                                />
                              </div>
                              <div className="flex gap-3 pt-2">
                                <button 
                                  onClick={() => setIsShiftModalOpen(false)}
                                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={handleAddShift}
                                  disabled={isSaving}
                                  className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                  {isSaving ? 'Creating...' : 'Create Shift'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeSubTab === 'working-hours' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Working Hours</h3>
                          <p className="text-xs text-gray-400">Define standard working hours for each day of the week</p>
                        </div>
                        <button 
                          onClick={handleSaveWorkSettings}
                          className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                      </div>
                      <div className="space-y-4">
                        {workingHours.map((wh, idx) => (
                          <div key={wh.day} className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-4 w-32">
                              <div className={`w-3 h-3 rounded-full ${!wh.active ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{wh.day}</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1 justify-end">
                              {!wh.active ? (
                                <span className="text-xs font-bold text-gray-400 italic">Weekend - Non-working day</span>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="time" 
                                      value={wh.start} 
                                      onChange={(e) => {
                                        const newHours = [...workingHours];
                                        newHours[idx].start = e.target.value;
                                        setWorkingHours(newHours);
                                      }}
                                      className="px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-blue-500" 
                                    />
                                    <span className="text-gray-400 text-xs">to</span>
                                    <input 
                                      type="time" 
                                      value={wh.end} 
                                      onChange={(e) => {
                                        const newHours = [...workingHours];
                                        newHours[idx].end = e.target.value;
                                        setWorkingHours(newHours);
                                      }}
                                      className="px-3 py-1.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:border-blue-500" 
                                    />
                                  </div>
                                  <div className="w-px h-4 bg-gray-200" />
                                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">9.0 Hours</span>
                                </>
                              )}
                              <div className="ml-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={wh.active} 
                                    onChange={(e) => {
                                      const newHours = [...workingHours];
                                      newHours[idx].active = e.target.checked;
                                      setWorkingHours(newHours);
                                    }}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <span className="ml-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'tracker-settings' ? (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 space-y-6">
                          {/* Late Coming Time */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Late Coming Time</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                value={trackerSettings.lateComingTime}
                                onChange={(e) => setTrackerSettings({...trackerSettings, lateComingTime: e.target.value})}
                                className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Minutes</span>
                            </div>
                          </div>

                          {/* Daily Overtime Limit */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Daily Overtime Limit</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                value={trackerSettings.dailyOvertimeLimit}
                                onChange={(e) => setTrackerSettings({...trackerSettings, dailyOvertimeLimit: e.target.value})}
                                className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Hours</span>
                            </div>
                          </div>

                          {/* Screenshots */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Screenshots</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.screenshots}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, screenshots: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Screenshot Interval */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Screenshot Interval</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                value={trackerSettings.screenshotInterval}
                                onChange={(e) => setTrackerSettings({...trackerSettings, screenshotInterval: e.target.value})}
                                className="flex-1 px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Minutes</span>
                            </div>
                          </div>

                          {/* Screenshot Delete Option */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Screenshot Delete Option</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.screenshotDelete}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, screenshotDelete: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Blur Screenshots */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Blur Screenshots</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.blurScreenshots}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, blurScreenshots: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Employee Edit Option */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Employee Edit Option</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.employeeEdit}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, employeeEdit: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Work Schedule */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Work Schedule</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.workSchedule}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, workSchedule: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Website & Application */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Website & Application</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={trackerSettings.websiteApplication}
                                  onChange={(e) => setTrackerSettings({...trackerSettings, websiteApplication: e.target.checked})}
                                  className="sr-only peer" 
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-black after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <button 
                          onClick={() => {
                            setTrackerSettings({
                              lateComingTime: '15',
                              dailyOvertimeLimit: '2',
                              screenshots: true,
                              screenshotInterval: '10',
                              screenshotDelete: true,
                              blurScreenshots: true,
                              employeeEdit: true,
                              workSchedule: true,
                              websiteApplication: true
                            });
                          }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                          <button 
                            onClick={handleSaveWorkSettings}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        {activeSubTab === 'shift' ? <Clock size={32} /> : 
                         activeSubTab === 'working-hours' ? <Clock size={32} /> :
                         activeSubTab === 'tracker-settings' ? <Zap size={32} /> :
                         <Target size={32} />}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            
            {activeTab === 'system' && (
              <>
                {/* System Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-gray-800">
                  {['Localization'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                      >
                        {tab}
                        {activeSubTab === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-8">
                  {activeSubTab === 'localization' ? (
                    <div className="space-y-8">
                      <div className="bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-6 space-y-8">
                          {/* Basic Information */}
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Basic Information</h3>
                            <div className="space-y-4">
                              {[
                                { label: 'Time Zone', name: 'timeZone', options: ['(+5:30) GMT', '(GMT-08:00) Pacific Time'] },
                                { label: 'Start Week On', name: 'startWeekOn', options: ['Monday', 'Sunday'] },
                                { label: 'Date Format', name: 'dateFormat', options: ['18 Mar 2025', '2025-03-18', '03/18/2025'] },
                                { label: 'Time Format', name: 'timeFormat', options: ['12 hrs', '24 hrs'] },
                                { label: 'Default Language', name: 'language', options: ['English', 'Spanish', 'French'] }
                              ].map((field) => (
                                <div key={field.label} className="flex items-center justify-between group">
                                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {field.label} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative w-72">
                                    <select 
                                      value={(localization as any)[field.name]}
                                      onChange={(e) => setLocalization({...localization, [field.name]: e.target.value})}
                                      className="w-full appearance-none px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-10 transition-all"
                                    >
                                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                      <ChevronDown size={16} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="h-px bg-gray-100 dark:bg-gray-900" />

                          {/* Currency Settings */}
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider">Currency Settings</h3>
                            <div className="space-y-4">
                              {[
                                { label: 'Currency', name: 'currency', options: ['USD', 'EUR', 'GBP'] },
                                { label: 'Currency Symbol', name: 'currencySymbol', options: ['$', '€', '£'] },
                                { label: 'Currency Position', name: 'currencyPosition', options: ['Before Amount', 'After Amount'] },
                                { label: 'Decimal Separator', name: 'decimalSeparator', options: ['.', ','] },
                                { label: 'Thousand Separator', name: 'thousandSeparator', options: [',', '.'] }
                              ].map((field) => (
                                <div key={field.label} className="flex items-center justify-between group">
                                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {field.label} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative w-72">
                                    <select 
                                      value={(localization as any)[field.name]}
                                      onChange={(e) => setLocalization({...localization, [field.name]: e.target.value})}
                                      className="w-full appearance-none px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-10 transition-all"
                                    >
                                      {field.options.map(opt => <option key={opt}>{opt}</option>)}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                      <ChevronDown size={16} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                          <button 
                            onClick={handleResetLocalization}
                            className="px-6 py-2 bg-gray-200 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <SettingsIcon size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-white capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}


          </div>
        </div>
      </div>

      {/* Notifications */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50">
          <CheckCircle2 size={20} />
          <div>
            <p className="text-sm font-bold">Changes Saved Successfully</p>
            <p className="text-xs opacity-90">Your profile has been updated.</p>
          </div>
        </div>
      )}

      {/* Modals */}

      {isDeptModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0B] rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            <div className="p-8 pb-4 flex justify-between items-center relative">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Add Department</h3>
                <p className="text-sm text-gray-400 mt-1">Define a new organizational unit</p>
              </div>
              <button onClick={() => setIsDeptModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 pt-6 space-y-6 relative">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Department Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Engineering"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-black transition-all dark:text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Department Head</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newDept.head}
                  onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-black transition-all dark:text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Budget</label>
                <input 
                  type="text" 
                  placeholder="e.g. $50,000"
                  value={newDept.budget}
                  onChange={(e) => setNewDept({ ...newDept, budget: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-black transition-all dark:text-white placeholder:text-gray-500"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsDeptModalOpen(false)} className="flex-1 px-4 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-black rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={handleAddDepartment} disabled={isSaving} className="flex-[2] px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black rounded-2xl hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Create Department'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0A0A0B] rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
            <div className="p-8 pb-4 flex justify-between items-center relative">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Add Employee Type</h3>
                <p className="text-sm text-gray-400 mt-1">Define a new category of employment</p>
              </div>
              <button onClick={() => setIsTypeModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 pt-6 space-y-6 relative">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Type Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Full-Time"
                  value={newType.type}
                  onChange={(e) => setNewType({ ...newType, type: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-black transition-all dark:text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Theme Color</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    'bg-blue-500/10 text-blue-600',
                    'bg-emerald-500/10 text-emerald-600',
                    'bg-purple-500/10 text-purple-600',
                    'bg-amber-500/10 text-amber-600',
                    'bg-rose-500/10 text-rose-600'
                  ].map(c => (
                    <button 
                      key={c}
                      onClick={() => setNewType({ ...newType, color: c })}
                      className={`w-full aspect-square rounded-xl ${c.split(' ')[0]} border-2 transition-all ${newType.color === c ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsTypeModalOpen(false)} className="flex-1 px-4 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-black rounded-2xl hover:bg-gray-200 transition-all">Cancel</button>
                <button onClick={handleAddEmployeeType} disabled={isSaving} className="flex-[2] px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black rounded-2xl hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Create Type'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Designation Modal */}
      {isDesigModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDesigModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-black w-full max-w-md p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl">
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1">Add Role</h3>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Department: {selectedDeptForDesig?.name}</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Role Name</label>
                <input 
                  type="text" 
                  value={newDesigName}
                  onChange={(e) => setNewDesigName(e.target.value)}
                  placeholder="e.g. Senior Developer"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl text-sm outline-none focus:border-blue-600 dark:text-white"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsDesigModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddDesignation}
                  className="flex-[2] py-3 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20"
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
