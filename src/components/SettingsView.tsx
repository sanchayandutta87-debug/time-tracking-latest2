import React, { useState, useEffect } from 'react';
import { 
  User, Building2, Briefcase, 
  Settings as SettingsIcon, Trash2, Camera, 
  ChevronRight, Globe, CheckCircle2,
  ChevronDown, Users,
  Zap, Target, Wand2, Eye, EyeOff, Clock, X, Loader2, Calendar
} from 'lucide-react';
import { supabase } from '../utils/supabase';

type SettingsTab = 'account' | 'company' | 'work' | 'system';
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
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [activeSubTab, setActiveSubTab] = useState<string>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    name: 'Max INC',
    owner: 'Osborne',
    email: 'stevenosborne@example.com',
    countryCode: '+1',
    phone: '(201) 555-0123',
    industry: 'Technology',
    teamSize: '51-200',
    address: 'Bamangacchi',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    taxId: 'XX-XXXXXXX',
    timezone: '(GMT-08:00) Pacific Time (US & Canada)',
    currency: 'USD ($) - US Dollar',
    website: 'https://example.com'
  });
  const [companyLogo, setCompanyLogo] = useState('https://picsum.photos/seed/company/120/120');
  const companyFileInputRef = React.useRef<HTMLInputElement>(null);

  // Departments State
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', head: 'Alex Rivera', members: 42, budget: '$1.2M' },
    { id: 2, name: 'Product', head: 'Sarah Chen', members: 18, budget: '$600K' },
    { id: 3, name: 'Marketing', head: 'James Wilson', members: 24, budget: '$450K' },
    { id: 4, name: 'Sales', head: 'Maria Garcia', members: 35, budget: '$800K' },
    { id: 5, name: 'HR', head: 'Linda Thompson', members: 8, budget: '$200K' },
    { id: 6, name: 'Finance', head: 'Robert Miller', members: 12, budget: '$350K' }
  ]);

  // Locations State
  const [locations, setLocations] = useState([
    { id: 1, name: 'Headquarters', address: 'San Francisco, CA', type: 'Office', employees: 120 },
    { id: 2, name: 'London Office', address: 'London, UK', type: 'Office', employees: 45 },
    { id: 3, name: 'Remote Hub', address: 'Global', type: 'Remote', employees: 85 }
  ]);

  // Employee Types State
  const [employeeTypes, setEmployeeTypes] = useState([
    { id: 1, type: 'Full-Time', count: 150, color: 'bg-emerald-100 text-emerald-600' },
    { id: 2, type: 'Part-Time', count: 25, color: 'bg-blue-100 text-blue-600' },
    { id: 3, type: 'Contractor', count: 40, color: 'bg-amber-100 text-amber-600' },
    { id: 4, type: 'Intern', count: 12, color: 'bg-purple-100 text-purple-600' }
  ]);

  // Holidays State
  const [holidays, setHolidays] = useState<any[]>([]);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    status: 'Active'
  });

  const fetchHolidays = async () => {
    setIsLoadingHolidays(true);
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHolidays(data || []);
    } catch (error) {
      console.error('Error fetching holiday types:', error);
    } finally {
      setIsLoadingHolidays(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'company' && activeSubTab === 'holidays') {
      fetchHolidays();
    }
  }, [activeTab, activeSubTab]);

  const handleAddHoliday = async () => {
    if (!newHoliday.name.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leave_types')
        .insert({
          name: newHoliday.name,
          status: 'Active'
        });

      if (error) throw error;
      setNewHoliday({ name: '', status: 'Active' });
      setIsHolidayModalOpen(false);
      fetchHolidays();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding holiday type:', error);
      alert('Error adding holiday type');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;
    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
  };

  // Work Settings State
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeaveName, setNewLeaveName] = useState('');
  const [isLoadingLeaves, setIsLoadingLeaves] = useState(false);

  const fetchLeaveTypes = async () => {
    setIsLoadingLeaves(true);
    try {
      const { data, error } = await supabase
        .from('leave_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('Error fetching leave types:', error);
    } finally {
      setIsLoadingLeaves(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'work' && activeSubTab === 'leave-types') {
      fetchLeaveTypes();
    }
  }, [activeTab, activeSubTab]);

  const handleAddLeaveType = async () => {
    if (!newLeaveName.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('leave_types')
        .insert({ name: newLeaveName, status: 'Active' });

      if (error) throw error;
      setNewLeaveName('');
      setIsLeaveModalOpen(false);
      fetchLeaveTypes();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding leave type:', error);
      alert('Error adding leave type');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLeaveType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave type?')) return;
    try {
      const { error } = await supabase
        .from('leave_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchLeaveTypes();
    } catch (error) {
      console.error('Error deleting leave type:', error);
    }
  };

  const [shifts, setShifts] = useState([
    { id: 1, name: 'Morning Shift', time: '09:00 AM - 06:00 PM', members: 120, color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Evening Shift', time: '02:00 PM - 11:00 PM', members: 45, color: 'bg-amber-100 text-amber-600' },
    { id: 3, name: 'Night Shift', time: '10:00 PM - 07:00 AM', members: 30, color: 'bg-purple-100 text-purple-600' }
  ]);

  const [workingHours, setWorkingHours] = useState([
    { day: 'Monday', start: '09:00', end: '18:00', active: true },
    { day: 'Tuesday', start: '09:00', end: '18:00', active: true },
    { day: 'Wednesday', start: '09:00', end: '18:00', active: true },
    { day: 'Thursday', start: '09:00', end: '18:00', active: true },
    { day: 'Friday', start: '09:00', end: '18:00', active: true },
    { day: 'Saturday', start: '09:00', end: '18:00', active: false },
    { day: 'Sunday', start: '09:00', end: '18:00', active: false },
  ]);

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

  // Tracker Settings State
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



  // Handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfileImage(url);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(`https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=random`);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    handleSave();
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
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



  const handleResetProfile = () => {
    setProfileData({
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
  };

  const handleResetCompany = () => {
    setCompanyData({
      name: 'Max INC',
      owner: 'Osborne',
      email: 'stevenosborne@example.com',
      countryCode: '+1',
      phone: '(201) 555-0123',
      industry: 'Technology',
      teamSize: '51-200',
      address: 'Bamangacchi',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      taxId: 'XX-XXXXXXX',
      timezone: '(GMT-08:00) Pacific Time (US & Canada)',
      currency: 'USD ($) - US Dollar',
      website: 'https://example.com'
    });
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
    { id: 'account', label: 'Account Settings', icon: <User size={18} /> },
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
            {activeTab === 'account' && (
              <>
                {/* Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setActiveSubTab('profile')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Profile Settings
                    {activeSubTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('security')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'security' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Security
                    {activeSubTab === 'security' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                </div>

                <div className="p-8">
                  {activeSubTab === 'profile' ? (
                    <div className="space-y-10">
                      {/* Profile Picture */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Profile</h3>
                        <p className="text-xs text-gray-400 mb-6">Upload profile picture</p>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                              referrerPolicy="no-referrer"
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                              <Camera size={14} />
                            </button>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                                Change Image
                              </button>
                              <button onClick={handleRemoveImage} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
                                Remove
                              </button>
                            </div>
                            <p className="text-[10px] text-gray-400">Recommended size is 300px x 300px</p>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Basic Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Basic Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your personal information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">First Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={profileData.firstName}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Last Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={profileData.lastName}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
                            <input 
                              type="email" 
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Phone Number <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                              <div className="relative w-28">
                                <select 
                                  name="countryCode"
                                  value={profileData.countryCode}
                                  onChange={handleProfileChange}
                                  className="w-full appearance-none px-3 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none pr-8 cursor-pointer"
                                >
                                  {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.dialCode}>
                                      {c.flag} {c.code} {c.dialCode}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                              </div>
                              <input 
                                type="tel" 
                                name="phone"
                                value={profileData.phone}
                                onChange={handleProfileChange}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
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
                              value={profileData.address}
                              onChange={handleProfileChange}
                              placeholder="Enter your address"
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Country <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                name="country"
                                value={profileData.country}
                                onChange={handleProfileChange}
                                placeholder="Enter your country"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">State / Province <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                name="state"
                                value={profileData.state}
                                onChange={handleProfileChange}
                                placeholder="Enter your state"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">City <span className="text-red-500">*</span></label>
                              <input 
                                type="text"
                                name="city"
                                value={profileData.city}
                                onChange={handleProfileChange}
                                placeholder="Enter your city"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Postal Code <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                name="postalCode"
                                value={profileData.postalCode}
                                onChange={handleProfileChange}
                                placeholder="Enter postal code"
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                        <button 
                          onClick={handleResetProfile}
                          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-10">
                      {/* Security Tab Content */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Password Management</h3>
                        <p className="text-xs text-gray-400 mb-6">Update your password to stay secure</p>
                        <div className="grid grid-cols-1 gap-6 max-w-md">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current Password</label>
                            <div className="relative">
                              <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                name="current"
                                value={passwords.current}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
                              >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New Password</label>
                            <div className="relative">
                              <input 
                                type={showNewPassword ? "text" : "password"} 
                                name="new"
                                value={passwords.new}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
                              >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                            <div className="relative">
                              <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handlePasswordChange}
                                className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-10"
                              />
                              <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                          <button onClick={handleUpdatePassword} className="w-fit px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            Update Password
                          </button>
                        </div>
                      </section>


                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'company' && (
              <>
                {/* Company Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100 dark:border-gray-800">
                  <button 
                    onClick={() => setActiveSubTab('organization')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'organization' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Organization
                    {activeSubTab === 'organization' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('departments')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'departments' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Departments
                    {activeSubTab === 'departments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('locations')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'locations' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Locations
                    {activeSubTab === 'locations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('employee-type')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'employee-type' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Employee Type
                    {activeSubTab === 'employee-type' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('holidays')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'holidays' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600 dark:text-gray-400'}`}
                  >
                    Holidays
                    {activeSubTab === 'holidays' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                </div>

                <div className="p-8">
                  {activeSubTab === 'organization' ? (
                    <div className="space-y-10">
                      {/* Company Profile */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Profile</h3>
                        <p className="text-xs text-gray-400 mb-6">Upload profile picture</p>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <input 
                              type="file"
                              ref={companyFileInputRef}
                              onChange={handleCompanyLogoUpload}
                              className="hidden"
                              accept="image/*"
                            />
                            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center p-4 border-4 border-gray-50 overflow-hidden">
                              <img 
                                src={companyLogo} 
                                alt="Company Logo" 
                                className="w-full h-full object-contain invert"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <button 
                              onClick={() => companyFileInputRef.current?.click()}
                              className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                              <Camera size={14} />
                            </button>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <button 
                                onClick={() => companyFileInputRef.current?.click()}
                                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                              >
                                Change Image
                              </button>
                              <button 
                                onClick={handleRemoveCompanyLogo}
                                className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-[10px] text-gray-400">Recommended size is 300px x 300px</p>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Basic Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">Basic Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your organization's core details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Organization Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="name"
                              value={companyData.name}
                              onChange={handleCompanyChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Owner Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              name="owner"
                              value={companyData.owner}
                              onChange={handleCompanyChange}
                              className="w-full px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Address <span className="text-red-500">*</span></label>
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
                            <div className="flex gap-2">
                              <div className="relative w-28">
                                <select 
                                  name="countryCode"
                                  value={companyData.countryCode}
                                  onChange={handleCompanyChange}
                                  className="w-full appearance-none px-3 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none pr-8 cursor-pointer"
                                >
                                  {COUNTRIES.map(c => (
                                    <option key={c.code} value={c.dialCode}>
                                      {c.flag} {c.code} {c.dialCode}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                              </div>
                              <input 
                                type="tel" 
                                name="phone"
                                value={companyData.phone}
                                onChange={handleCompanyChange}
                                className="flex-1 px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Industry <span className="text-red-500">*</span></label>
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
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Owner</label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                <option>Select</option>
                                <option>Steven Osborne</option>
                                <option>Jenny Ellis</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <button className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-black transition-colors">
                            Update
                          </button>
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
                          onClick={handleSave}
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
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Department
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {departments.map((dept) => (
                          <div key={dept.id} className="p-5 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 group hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Briefcase size={20} />
                              </div>
                              <button 
                                onClick={() => setDepartments(departments.filter(d => d.id !== dept.id))}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{dept.name}</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Head</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{dept.head}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Members</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{dept.members}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Budget</span>
                                <span className="text-emerald-600 font-bold">{dept.budget}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'locations' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Locations</h3>
                          <p className="text-xs text-gray-400">Manage your office locations and remote hubs</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Location
                        </button>
                      </div>
                      <div className="space-y-4">
                        {locations.map((loc) => (
                          <div key={loc.id} className="p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800">
                                <Globe size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-white">{loc.name}</p>
                                <p className="text-xs text-gray-400">{loc.address} • {loc.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{loc.employees}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Employees</p>
                              </div>
                              <button 
                                onClick={() => setLocations(locations.filter(l => l.id !== loc.id))}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'employee-type' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Employee Types</h3>
                          <p className="text-xs text-gray-400">Define employment categories for your team</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Type
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employeeTypes.map((item) => (
                          <div key={item.id} className="p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                                <Users size={16} />
                              </div>
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.type}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.count} members</span>
                              <button 
                                onClick={() => setEmployeeTypes(employeeTypes.filter(e => e.id !== item.id))}
                                className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'holidays' ? (
                    <div className="space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                              <Calendar size={20} />
                            </span>
                            Holiday Types
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">Define categories for employee holiday time off</p>
                        </div>
                        <button 
                          onClick={() => setIsHolidayModalOpen(true)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
                        >
                          Add New Type
                        </button>
                      </div>

                      <div className="bg-white dark:bg-[#0A0A0B]/80 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[32px] overflow-hidden shadow-2xl shadow-black/5">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5">
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Holiday Name</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Created Date</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {isLoadingHolidays ? (
                              <tr>
                                <td colSpan={4} className="px-8 py-16 text-center text-gray-400">
                                  <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
                                  <p className="font-bold uppercase tracking-widest text-[10px]">Fetching Types...</p>
                                </td>
                              </tr>
                            ) : holidays.length > 0 ? holidays.map((holiday) => (
                              <tr key={holiday.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/[0.01] transition-all duration-300 group">
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                      <Zap size={18} />
                                    </div>
                                    <p className="font-bold text-gray-800 dark:text-white tracking-tight">{holiday.name}</p>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-gray-500 dark:text-gray-400 font-medium">
                                  {new Date(holiday.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-8 py-6">
                                  <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                                    {holiday.status}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <button 
                                    onClick={() => handleDeleteHoliday(holiday.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">No holiday types found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Add Holiday Modal */}
                      {isHolidayModalOpen && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                          <div className="bg-white dark:bg-[#0A0A0B] rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-white/10 relative">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
                            
                            <div className="p-8 pb-4 flex justify-between items-center relative">
                              <div>
                                <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Create Holiday Type</h3>
                                <p className="text-sm text-gray-400 mt-1">This will be available for all employees</p>
                              </div>
                              <button 
                                onClick={() => setIsHolidayModalOpen(false)} 
                                className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/20 transition-all"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            <div className="p-8 pt-6 space-y-8 relative">
                              <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Type Name</label>
                                <div className="relative group">
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <Target size={20} />
                                  </div>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Festival Leave"
                                    value={newHoliday.name}
                                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-black transition-all dark:text-white placeholder:text-gray-500"
                                  />
                                </div>
                              </div>

                              <div className="flex gap-4 pt-2">
                                <button 
                                  onClick={() => setIsHolidayModalOpen(false)}
                                  className="flex-1 px-4 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                >
                                  Nevermind
                                </button>
                                <button 
                                  onClick={handleAddHoliday}
                                  disabled={isSaving}
                                  className="flex-[2] px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black rounded-2xl hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                  {isSaving ? (
                                    <>
                                      <Loader2 size={18} className="animate-spin" />
                                      Creating...
                                    </>
                                  ) : 'Create Now'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
                  {['Leave Types', 'Shift', 'Working Hours', 'Tracker Settings', 'Productivity Ratings'].map((tab) => {
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
                          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
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
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
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
                                onClick={() => setShifts(shifts.filter(s => s.id !== shift.id))}
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
                    </div>
                  ) : activeSubTab === 'working-hours' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Working Hours</h3>
                          <p className="text-xs text-gray-400">Define standard working hours for each day of the week</p>
                        </div>
                        <button 
                          onClick={handleSave}
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
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : activeSubTab === 'productivity-ratings' ? (
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">App/Website</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Total Time (H)</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Category</th>
                              <th className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">Label</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { name: 'Figma', domain: 'figma.com', time: '09h 45m', category: 'Design' },
                              { name: 'Google Chrome', domain: 'google.com', time: '09h 20m', category: 'Browser' },
                              { name: 'Adobe Illustrator', domain: 'adobe.com', time: '09h 30m', category: 'Design' },
                              { name: 'Slack', domain: 'slack.com', time: '09h 00m', category: 'Design' },
                              { name: 'Google Docs', domain: 'docs.google.com', time: '09h 25m', category: 'Design' }
                            ].map((item) => (
                              <tr key={item.name} className="hover:bg-white dark:bg-black transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800">
                                      <img 
                                        src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`} 
                                        alt={item.name}
                                        className="w-6 h-6 object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <span className="font-bold text-gray-800 dark:text-white">{item.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{item.time}</td>
                                <td className="px-6 py-4">
                                  <div className="relative w-32">
                                    <select className="w-full appearance-none px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-8">
                                      <option>{item.category}</option>
                                      <option>Development</option>
                                      <option>Communication</option>
                                      <option>Entertainment</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                      <ChevronDown size={14} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="relative w-32">
                                    <select className="w-full appearance-none px-4 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer pr-8">
                                      <option>Select</option>
                                      <option>Work</option>
                                      <option>Personal</option>
                                      <option>Other</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                      <ChevronDown size={14} />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
    </div>
  );
}
