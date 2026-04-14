import React, { useState } from 'react';
import { 
  User, Building2, Briefcase, CreditCard, 
  Settings as SettingsIcon, Trash2, Camera, 
  ChevronRight, Shield, Bell, Globe, 
  Smartphone, Key, LogOut, CheckCircle2,
  AlertCircle, ChevronDown, MoreVertical, Users,
  Clock, Zap, Target, Wand2, Search, Plus, Crown, Pencil
} from 'lucide-react';

type SettingsTab = 'account' | 'company' | 'work' | 'finance' | 'system' | 'billing' | 'delete';
type AccountSubTab = 'profile' | 'security';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [activeSubTab, setActiveSubTab] = useState<string>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      gray: { bg: 'bg-slate-700', hover: 'hover:bg-slate-800', text: 'text-slate-700', border: 'border-slate-700', ring: 'ring-slate-500' },
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

  const sidebarItems = [
    { id: 'account', label: 'Account Settings', icon: <User size={18} /> },
    { id: 'company', label: 'Company Settings', icon: <Building2 size={18} /> },
    { id: 'work', label: 'Work Settings', icon: <Briefcase size={18} /> },
    { id: 'finance', label: 'Finance & Accounts', icon: <CreditCard size={18} /> },
    { id: 'system', label: 'System Settings', icon: <SettingsIcon size={18} /> },
    { id: 'billing', label: 'Plans & Billing', icon: <CreditCard size={18} /> },
    { id: 'delete', label: 'Delete Account', icon: <Trash2 size={18} /> },
  ];

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (tab === 'account') setActiveSubTab('profile');
    else if (tab === 'company') setActiveSubTab('organization');
    else if (tab === 'work') setActiveSubTab('leave-types');
    else if (tab === 'finance') setActiveSubTab('expense-category');
    else if (tab === 'system') setActiveSubTab('localization');
  };

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Settings</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 border-blue-600' 
                    : 'text-gray-500 hover:bg-gray-50 border-transparent'
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
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {activeTab === 'account' && (
              <>
                {/* Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100">
                  <button 
                    onClick={() => setActiveSubTab('profile')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'profile' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Profile Settings
                    {activeSubTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('security')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'security' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Profile</h3>
                        <p className="text-xs text-gray-400 mb-6">Upload profile picture</p>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <img 
                              src="https://picsum.photos/seed/profile/120/120" 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full object-cover border-4 border-gray-50"
                              referrerPolicy="no-referrer"
                            />
                            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                              <Camera size={14} />
                            </button>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <button className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                                Change Image
                              </button>
                              <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Basic Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your personal information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              defaultValue="Shaun"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              defaultValue="Farley"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <input 
                              type="email" 
                              defaultValue="shaun.farley@example.com"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <input 
                              type="tel" 
                              defaultValue="+1 (555) 000-0000"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Address Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Address Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your address details</p>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Address <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              placeholder="Enter your address"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>United States</option>
                                  <option>United Kingdom</option>
                                  <option>Canada</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">State <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>California</option>
                                  <option>New York</option>
                                  <option>Texas</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>Los Angeles</option>
                                  <option>San Francisco</option>
                                  <option>San Diego</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">Postal Code <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                placeholder="Enter postal code"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                        <button className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Password Management</h3>
                        <p className="text-xs text-gray-400 mb-6">Update your password to stay secure</p>
                        <div className="grid grid-cols-1 gap-6 max-w-md">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Current Password</label>
                            <div className="relative">
                              <input 
                                type="password" 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                              <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Confirm New Password</label>
                            <input 
                              type="password" 
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <button className="w-fit px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            Update Password
                          </button>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-400 mb-6">Add an extra layer of security to your account</p>
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                              <Shield size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-blue-900">2FA is currently disabled</p>
                              <p className="text-xs text-blue-700">Enable to protect your account from unauthorized access</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            Enable Now
                          </button>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Active Sessions</h3>
                        <p className="text-xs text-gray-400 mb-6">Devices currently logged into your account</p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                <Globe size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">Chrome on macOS <span className="ml-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">CURRENT</span></p>
                                <p className="text-xs text-gray-400">San Francisco, USA • 192.168.1.1</p>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-red-600 hover:underline">Log Out</button>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                <Smartphone size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">iPhone 13 Pro</p>
                                <p className="text-xs text-gray-400">San Francisco, USA • 2 hours ago</p>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-red-600 hover:underline">Log Out</button>
                          </div>
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
                <div className="flex items-center gap-8 px-8 border-b border-gray-100">
                  <button 
                    onClick={() => setActiveSubTab('organization')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'organization' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Organization
                    {activeSubTab === 'organization' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('departments')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'departments' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Departments
                    {activeSubTab === 'departments' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('locations')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'locations' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Locations
                    {activeSubTab === 'locations' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('employee-type')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'employee-type' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Employee Type
                    {activeSubTab === 'employee-type' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                  <button 
                    onClick={() => setActiveSubTab('holidays')}
                    className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === 'holidays' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Profile</h3>
                        <p className="text-xs text-gray-400 mb-6">Upload profile picture</p>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-black flex items-center justify-center p-4 border-4 border-gray-50">
                              <img 
                                src="https://picsum.photos/seed/company/120/120" 
                                alt="Company Logo" 
                                className="w-full h-full object-contain invert"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white shadow-sm hover:bg-blue-700 transition-colors">
                              <Camera size={14} />
                            </button>
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <button className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                                Change Image
                              </button>
                              <button className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors">
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Basic Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your organization's core details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Organization Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              defaultValue="Max INC"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Owner Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              defaultValue="Osborne"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                            <input 
                              type="email" 
                              defaultValue="stevenosborne@example.com"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                              <div className="relative w-24">
                                <select className="w-full appearance-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none pr-8">
                                  <option>🇺🇸 +1</option>
                                  <option>🇬🇧 +44</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                              </div>
                              <input 
                                type="tel" 
                                defaultValue="(201) 555-0123"
                                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Industry <span className="text-red-500">*</span></label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                <option>Technology</option>
                                <option>Healthcare</option>
                                <option>Finance</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Team Size</label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Timezone & Currency</h3>
                        <p className="text-xs text-gray-400 mb-6">Set default regional settings for your organization</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Default Timezone</label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                                <option>(GMT+00:00) London</option>
                                <option>(GMT+05:30) India</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Default Currency</label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
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
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Social Profiles</h3>
                        <p className="text-xs text-gray-400 mb-6">Connect your organization's social media accounts</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">LinkedIn</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="linkedin.com/company/..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Website</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                placeholder="https://example.com"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Tax Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Tax Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Manage tax registration and identification numbers</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Tax ID / EIN</label>
                            <input 
                              type="text" 
                              placeholder="XX-XXXXXXX"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">VAT Number (Optional)</label>
                            <input 
                              type="text" 
                              placeholder="Enter VAT number"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Address Information */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Address Information</h3>
                        <p className="text-xs text-gray-400 mb-6">Your address details</p>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700">Address <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              defaultValue="87 Griffin Street"
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">Country <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>United States</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">State <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>New York</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                              <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                  <option>Select</option>
                                  <option>New York City</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-700">Postal Code <span className="text-red-500">*</span></label>
                              <input 
                                type="text" 
                                defaultValue="90001"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <hr className="border-gray-50" />

                      {/* Transfer Ownership */}
                      <section>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Transfer Ownership</h3>
                        <p className="text-xs text-gray-400 mb-6">You must select an existing admin to transfer ownership.</p>
                        <div className="flex gap-4 items-end max-w-2xl">
                          <div className="flex-1 space-y-2">
                            <label className="text-xs font-bold text-gray-700">Owner</label>
                            <div className="relative">
                              <select className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                <option>Select</option>
                                <option>Steven Osborne</option>
                                <option>Jenny Ellis</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                          </div>
                          <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            Update
                          </button>
                        </div>
                      </section>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
                        <button className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
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
                          <h3 className="text-sm font-bold text-gray-800">Departments</h3>
                          <p className="text-xs text-gray-400">Manage your organization's departments</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Department
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { name: 'Engineering', head: 'Alex Rivera', members: 42, budget: '$1.2M' },
                          { name: 'Product', head: 'Sarah Chen', members: 18, budget: '$600K' },
                          { name: 'Marketing', head: 'James Wilson', members: 24, budget: '$450K' },
                          { name: 'Sales', head: 'Maria Garcia', members: 35, budget: '$800K' },
                          { name: 'HR', head: 'Linda Thompson', members: 8, budget: '$200K' },
                          { name: 'Finance', head: 'Robert Miller', members: 12, budget: '$350K' }
                        ].map((dept) => (
                          <div key={dept.name} className="p-5 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                <Briefcase size={20} />
                              </div>
                              <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 mb-1">{dept.name}</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Head</span>
                                <span className="text-gray-700 font-medium">{dept.head}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400 uppercase tracking-wider font-bold">Members</span>
                                <span className="text-gray-700 font-medium">{dept.members}</span>
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
                          <h3 className="text-sm font-bold text-gray-800">Locations</h3>
                          <p className="text-xs text-gray-400">Manage your office locations and remote hubs</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Location
                        </button>
                      </div>
                      <div className="space-y-4">
                        {[
                          { name: 'Headquarters', address: 'San Francisco, CA', type: 'Office', employees: 120 },
                          { name: 'London Office', address: 'London, UK', type: 'Office', employees: 45 },
                          { name: 'Remote Hub', address: 'Global', type: 'Remote', employees: 85 }
                        ].map((loc) => (
                          <div key={loc.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
                                <Globe size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-800">{loc.name}</p>
                                <p className="text-xs text-gray-400">{loc.address} • {loc.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-xs font-bold text-gray-700">{loc.employees}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Employees</p>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={16} />
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
                          <h3 className="text-sm font-bold text-gray-800">Employee Types</h3>
                          <p className="text-xs text-gray-400">Define employment categories for your team</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          Add Type
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { type: 'Full-Time', count: 150, color: 'bg-emerald-100 text-emerald-600' },
                          { type: 'Part-Time', count: 25, color: 'bg-blue-100 text-blue-600' },
                          { type: 'Contractor', count: 40, color: 'bg-amber-100 text-amber-600' },
                          { type: 'Intern', count: 12, color: 'bg-purple-100 text-purple-600' }
                        ].map((item) => (
                          <div key={item.type} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                                <Users size={16} />
                              </div>
                              <span className="text-sm font-bold text-gray-700">{item.type}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-500">{item.count} members</span>
                              <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'holidays' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">Holiday Calendar</h3>
                          <p className="text-xs text-gray-400">Manage public holidays and company-wide time off for 2026</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
                            Import Calendar
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            Add Holiday
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Holiday Name</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Date</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { name: 'New Year\'s Day', date: 'Jan 01, 2026', type: 'Public', status: 'Passed' },
                              { name: 'Good Friday', date: 'Apr 03, 2026', type: 'Public', status: 'Upcoming' },
                              { name: 'Labor Day', date: 'May 01, 2026', type: 'Public', status: 'Upcoming' },
                              { name: 'Independence Day', date: 'Jul 04, 2026', type: 'Public', status: 'Upcoming' },
                              { name: 'Company Foundation Day', date: 'Oct 15, 2026', type: 'Company', status: 'Upcoming' },
                              { name: 'Christmas Day', date: 'Dec 25, 2026', type: 'Public', status: 'Upcoming' }
                            ].map((holiday) => (
                              <tr key={holiday.name} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-800">{holiday.name}</td>
                                <td className="px-6 py-4 text-gray-500">{holiday.date}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${holiday.type === 'Public' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {holiday.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`flex items-center gap-1.5 text-xs ${holiday.status === 'Passed' ? 'text-gray-400' : 'text-emerald-600 font-medium'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${holiday.status === 'Passed' ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                                    {holiday.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Building2 size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'work' && (
              <>
                {/* Work Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100">
                  {['Leave Types', 'Shift', 'Working Hours', 'Tracker Settings', 'Productivity Ratings'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                        <h3 className="text-lg font-bold text-gray-800">Leave Type</h3>
                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            <Wand2 size={14} />
                            Leave type
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            + Add New
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Leave Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Created Date</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { name: 'Casual Leave', date: '25 Nov 2025', status: 'Active' },
                              { name: 'Sick Leave', date: '24 Sep 2025', status: 'Active' },
                              { name: 'Maternity', date: '21 July 2025', status: 'Active' },
                              { name: 'Paternity', date: '15 Mar 2025', status: 'Active' },
                              { name: 'Annual Leave', date: '16 Feb 2025', status: 'Active' },
                              { name: 'Permission', date: '18 Feb 2025', status: 'Active' }
                            ].map((item) => (
                              <tr key={item.name} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'shift' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Work Shifts</h3>
                          <p className="text-xs text-gray-400">Manage your organization's work shifts and timings</p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          + Add Shift
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { name: 'Morning Shift', time: '09:00 AM - 06:00 PM', members: 120, color: 'bg-blue-100 text-blue-600' },
                          { name: 'Evening Shift', time: '02:00 PM - 11:00 PM', members: 45, color: 'bg-amber-100 text-amber-600' },
                          { name: 'Night Shift', time: '10:00 PM - 07:00 AM', members: 30, color: 'bg-purple-100 text-purple-600' }
                        ].map((shift) => (
                          <div key={shift.name} className="p-5 bg-gray-50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all">
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-10 h-10 ${shift.color} rounded-lg flex items-center justify-center`}>
                                <Clock size={20} />
                              </div>
                              <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                            <h4 className="text-sm font-bold text-gray-800 mb-1">{shift.name}</h4>
                            <p className="text-xs text-gray-500 mb-4">{shift.time}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Members</span>
                              <span className="text-xs font-bold text-gray-700">{shift.members}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : activeSubTab === 'working-hours' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Working Hours</h3>
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
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <div key={day} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4 w-32">
                              <div className={`w-3 h-3 rounded-full ${day === 'Saturday' || day === 'Sunday' ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                              <span className="text-sm font-bold text-gray-700">{day}</span>
                            </div>
                            <div className="flex items-center gap-4 flex-1 justify-end">
                              {day === 'Saturday' || day === 'Sunday' ? (
                                <span className="text-xs font-bold text-gray-400 italic">Weekend - Non-working day</span>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2">
                                    <input type="time" defaultValue="09:00" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500" />
                                    <span className="text-gray-400 text-xs">to</span>
                                    <input type="time" defaultValue="18:00" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500" />
                                  </div>
                                  <div className="w-px h-4 bg-gray-200" />
                                  <span className="text-xs font-bold text-gray-500">9.0 Hours</span>
                                </>
                              )}
                              <div className="ml-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" defaultChecked={day !== 'Saturday' && day !== 'Sunday'} className="sr-only peer" />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
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
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-6">
                          {/* Late Coming Time */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Late Coming Time</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                placeholder="" 
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Minutes</span>
                            </div>
                          </div>

                          {/* Daily Overtime Limit */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Daily Overtime Limit</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                placeholder="" 
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Hours</span>
                            </div>
                          </div>

                          {/* Screenshots */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Screenshots</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Screenshot Interval */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Screenshot Interval</label>
                            <div className="flex items-center gap-3 w-72">
                              <input 
                                type="text" 
                                placeholder="" 
                                className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                              />
                              <span className="text-sm text-gray-400 w-16">Minutes</span>
                            </div>
                          </div>

                          {/* Screenshot Delete Option */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Screenshot Delete Option</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Blur Screenshots */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Blur Screenshots</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Employee Edit Option */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Employee Edit Option</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Work Schedule */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Work Schedule</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>

                          {/* Website & Application */}
                          <div className="flex items-center justify-between group">
                            <label className="text-sm font-bold text-gray-700">Website & Application</label>
                            <div className="w-72">
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                          <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors">
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
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">App/Website</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Total Time (H)</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Category</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Label</th>
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
                              <tr key={item.name} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                      <img 
                                        src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`} 
                                        alt={item.name}
                                        className="w-6 h-6 object-contain"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <span className="font-bold text-gray-800">{item.name}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{item.time}</td>
                                <td className="px-6 py-4">
                                  <div className="relative w-32">
                                    <select className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-8">
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
                                    <select className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-8">
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
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        {activeSubTab === 'shift' ? <Clock size={32} /> : 
                         activeSubTab === 'working-hours' ? <Clock size={32} /> :
                         activeSubTab === 'tracker-settings' ? <Zap size={32} /> :
                         <Target size={32} />}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'finance' && (
              <>
                {/* Finance Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100">
                  {['Expense Category', 'Expense Type', 'Payment Method', 'Currencies', 'Taxes'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {tab}
                        {activeSubTab === id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
                      </button>
                    );
                  })}
                </div>

                <div className="p-8">
                  {activeSubTab === 'expense-category' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Expense Category</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <span className="text-lg">+</span> Add New
                        </button>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Category</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              'Depreciation', 'Advertising', 'Maintenance', 
                              'Travel', 'Office supplies', 'Utilities'
                            ].map((category) => (
                              <tr key={category} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-800">{category}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'expense-type' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Expense Type</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <span className="text-lg">+</span> Add New
                        </button>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Category</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { type: 'Rental', category: 'Travel' },
                              { type: 'Reservation', category: 'Travel' },
                              { type: 'Flight Travel', category: 'Travel' },
                              { type: 'Promotion', category: 'Advertising' },
                              { type: 'Stationery', category: 'Office Supplies' },
                              { type: 'Cleaning Supplies', category: 'Office Supplies' },
                              { type: 'Chairs & Tables', category: 'Office Supplies' },
                              { type: 'Electricity', category: 'Utilities' },
                              { type: 'Water Supply', category: 'Utilities' }
                            ].map((item) => (
                              <tr key={item.type} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-gray-800">{item.type}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{item.category}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'payment-method' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Payment Methods</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          + Add Method
                        </button>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Method Name</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { name: 'Cash', type: 'Offline' },
                              { name: 'Bank Transfer', type: 'Online' },
                              { name: 'Credit Card', type: 'Online' },
                              { name: 'PayPal', type: 'Online' }
                            ].map((method) => (
                              <tr key={method.name} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-gray-800">{method.name}</td>
                                <td className="px-6 py-4 text-gray-500">{method.type}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">Active</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'currencies' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800">Currencies</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                          + Add New
                        </button>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Currency</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Code</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Symbol</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Exchange Rate</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { name: 'US Dollar', code: 'USD', symbol: '$', rate: '1.0', isBase: true },
                              { name: 'Dhirams', code: 'AED', symbol: 'د.إ', rate: '3.67' },
                              { name: 'Rupee', code: 'INR', symbol: '₹', rate: '86.62' },
                              { name: 'Pound', code: 'GBP', symbol: '£', rate: '0.81' },
                              { name: 'Euro', code: 'EUR', symbol: '€', rate: '0.96' },
                              { name: 'Japanese Yen', code: 'JPY', symbol: '¥', rate: '0.96' },
                              { name: 'Canadian Dollar', code: 'CAD', symbol: '$', rate: '1.36' },
                              { name: 'Australian Dollar', code: 'AUD', symbol: '$', rate: '1.52' }
                            ].map((curr) => (
                              <tr key={curr.code} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800">{curr.name}</span>
                                    {curr.isBase && (
                                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">
                                        Base Currency
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">{curr.code}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{curr.symbol}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{curr.rate}</td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'taxes' ? (
                    <div className="space-y-8">
                      {/* Taxes Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-800">Taxes</h3>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            + Add New
                          </button>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">Tax Name</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Tax Rate</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Created Date</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {[
                                { name: 'VAT', rate: '10%', date: '24 Jan 2025' },
                                { name: 'CGST', rate: '08%', date: '20 Jan 2025' },
                                { name: 'SGST', rate: '10%', date: '15 Jan 2025' },
                                { name: 'Service Tax', rate: '05%', date: '10 Jan 2025' },
                                { name: 'Sales Tax', rate: '07%', date: '05 Jan 2025' }
                              ].map((tax) => (
                                <tr key={tax.name} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-6 py-4 font-bold text-gray-800">{tax.name}</td>
                                  <td className="px-6 py-4 text-gray-400 font-medium">{tax.rate}</td>
                                  <td className="px-6 py-4 text-gray-400 font-medium">{tax.date}</td>
                                  <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                      <MoreVertical size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Tax Group Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-gray-800">Tax Group</h3>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            + Add New
                          </button>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">Tax Name</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Tax Rate</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Created Date</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {[
                                { name: 'GST', rate: '18%', date: '24 Jan 2025' },
                                { name: 'IGST', rate: '12%', date: '20 Jan 2025' }
                              ].map((tax) => (
                                <tr key={tax.name} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-6 py-4 font-bold text-gray-800">{tax.name}</td>
                                  <td className="px-6 py-4 text-gray-400 font-medium">{tax.rate}</td>
                                  <td className="px-6 py-4 text-gray-400 font-medium">{tax.date}</td>
                                  <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                      Active
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                      <MoreVertical size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <CreditCard size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'system' && (
              <>
                {/* System Sub Tabs */}
                <div className="flex items-center gap-8 px-8 border-b border-gray-100">
                  {['Localization', 'Custom Fields', 'Preference', 'Appearance', 'Notifications', 'Integrations'].map((tab) => {
                    const id = tab.toLowerCase().replace(' ', '-');
                    return (
                      <button 
                        key={id}
                        onClick={() => setActiveSubTab(id)}
                        className={`py-4 text-sm font-bold transition-all relative ${activeSubTab === id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
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
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-8">
                          {/* Basic Information */}
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Basic Information</h3>
                            <div className="space-y-4">
                              {[
                                { label: 'Time Zone', value: '(+5:30) GMT' },
                                { label: 'Start Week On', value: 'Monday' },
                                { label: 'Date Format', value: '18 Mar 2025' },
                                { label: 'Time Format', value: '12 hrs' },
                                { label: 'Default Language', value: 'English' }
                              ].map((field) => (
                                <div key={field.label} className="flex items-center justify-between group">
                                  <label className="text-sm font-bold text-gray-700">
                                    {field.label} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative w-72">
                                    <select className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-10 transition-all">
                                      <option>{field.value}</option>
                                      <option>Option 1</option>
                                      <option>Option 2</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                      <ChevronDown size={16} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="h-px bg-gray-100" />

                          {/* Currency Settings */}
                          <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Currency Settings</h3>
                            <div className="space-y-4">
                              {[
                                { label: 'Currency', value: 'Select' },
                                { label: 'Currency Symbol', value: '$' },
                                { label: 'Currency Position', value: '$100' },
                                { label: 'Decimal Separator', value: '.' },
                                { label: 'Thousand Separator', value: '.' }
                              ].map((field) => (
                                <div key={field.label} className="flex items-center justify-between group">
                                  <label className="text-sm font-bold text-gray-700">
                                    {field.label} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative w-72">
                                    <select className="w-full appearance-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer pr-10 transition-all">
                                      <option>{field.value}</option>
                                      <option>Option 1</option>
                                      <option>Option 2</option>
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
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                          <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors">
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
                  ) : activeSubTab === 'custom-fields' ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-bold text-gray-800">Custom Fields</h3>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input 
                              type="text" 
                              placeholder="Search fields..." 
                              className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 w-48"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 focus:outline-none focus:border-blue-500">
                            <option>All Modules</option>
                            <option>Members</option>
                            <option>Projects</option>
                            <option>Teams</option>
                          </select>
                          <button className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Plus size={14} /> Add New
                          </button>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              <th className="px-6 py-4 font-bold text-gray-700">Module</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Label</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Type</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Default Value</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Required</th>
                              <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                              <th className="px-6 py-4 font-bold text-gray-700 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { module: 'Members', label: 'Member Type', type: 'Select', default: 'Full Time', required: true },
                              { module: 'Projects', label: 'Project Type', type: 'Select', default: 'Internal', required: true },
                              { module: 'Teams', label: 'Communication', type: 'Select', default: 'Gmail', required: true },
                              { module: 'Tasks', label: 'Priority Level', type: 'Select', default: 'Medium', required: false },
                              { module: 'Expenses', label: 'Department', type: 'Text', default: 'General', required: true }
                            ].map((field, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-gray-800">{field.module}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{field.label}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{field.type}</td>
                                <td className="px-6 py-4 text-gray-400 font-medium">{field.default}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${field.required ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'}`}>
                                    {field.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold uppercase">
                                    Active
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreVertical size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : activeSubTab === 'preference' ? (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-8">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Module Visibility</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                'Live Tracking', 'Timesheet', 'Leave',
                                'Attendance', 'Expense', 'Screenshots',
                                'Projects', 'Tasks', 'Manual Time',
                                'Employees', 'Teams', 'Clients',
                                'Users', 'Invoices', 'Reports'
                              ].map((module) => (
                                <div key={module} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-100 transition-all">
                                  <span className="text-sm font-bold text-gray-700">{module}</span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="h-px bg-gray-100" />

                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Advanced Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                    <Zap size={16} />
                                  </div>
                                  <p className="text-sm font-bold text-blue-900">API Access</p>
                                </div>
                                <p className="text-xs text-blue-700 mb-4">Enable external API access for third-party integrations.</p>
                                <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                  Generate API Key
                                </button>
                              </div>
                              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                                    <CheckCircle2 size={16} />
                                  </div>
                                  <p className="text-sm font-bold text-emerald-900">Data Export</p>
                                </div>
                                <p className="text-xs text-emerald-700 mb-4">Schedule automatic weekly data backups to your email.</p>
                                <button className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                                  Configure Export
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                          <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                          </button>
                          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : activeSubTab === 'appearance' ? (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-8 space-y-10">
                          {/* Theme Selection */}
                          <div className="flex items-start justify-between gap-12">
                            <div className="max-w-xs">
                              <h3 className="text-lg font-bold text-gray-800">Select Theme</h3>
                              <p className="text-sm text-gray-400 mt-1">Choose theme of website</p>
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-6">
                              {[
                                { id: 'Light', label: 'Light', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop' },
                                { id: 'Dark', label: 'Dark', img: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400&h=250&fit=crop' },
                                { id: 'Automatic', label: 'Automatic', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=250&fit=crop' }
                              ].map((item) => (
                                <button 
                                  key={item.id}
                                  onClick={() => setTheme(item.id)}
                                  className={`group relative flex flex-col items-center gap-3 transition-all ${theme === item.id ? getAccentClass('text') : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                  <div className={`w-full aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${theme === item.id ? `${getAccentClass('border')} ring-4 ${getAccentClass('ring').replace('500', '50')}` : 'border-gray-100 group-hover:border-gray-200'}`}>
                                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className={`text-sm font-bold ${theme === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Accent Color */}
                          <div className="flex items-start justify-between gap-12">
                            <div className="max-w-xs">
                              <h3 className="text-lg font-bold text-gray-800">Accent Color</h3>
                              <p className="text-sm text-gray-400 mt-1">Choose accent colour of website</p>
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                              {[
                                { id: 'blue', color: 'bg-blue-600' },
                                { id: 'gray', color: 'bg-slate-700' },
                                { id: 'green', color: 'bg-emerald-500' },
                                { id: 'red', color: 'bg-red-500' },
                                { id: 'sky', color: 'bg-sky-500' },
                                { id: 'orange', color: 'bg-amber-500' }
                              ].map((c) => (
                                <button 
                                  key={c.id}
                                  onClick={() => setAccentColor(c.id)}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${c.color} ${accentColor === c.id ? `ring-4 ring-offset-2 ${getAccentClass('ring')}` : 'hover:scale-110 opacity-80 hover:opacity-100'}`}
                                >
                                  {accentColor === c.id && <div className="w-2 h-2 bg-white rounded-full" />}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sidebar Size */}
                          <div className="flex items-start justify-between gap-12">
                            <div className="max-w-xs">
                              <h3 className="text-lg font-bold text-gray-800">Sidebar Size</h3>
                              <p className="text-sm text-gray-400 mt-1">Select size of the sidebar to display</p>
                            </div>
                            <div className="flex-1 relative max-w-md">
                              <select 
                                value={sidebarSize}
                                onChange={(e) => setSidebarSize(e.target.value)}
                                className={`w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:${getAccentClass('border')} cursor-pointer pr-10 transition-all`}
                              >
                                <option>Default</option>
                                <option>Compact</option>
                                <option>Wide</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          </div>

                          {/* Font Family */}
                          <div className="flex items-start justify-between gap-12">
                            <div className="max-w-xs">
                              <h3 className="text-lg font-bold text-gray-800">Font Family</h3>
                              <p className="text-sm text-gray-400 mt-1">Select font family of website</p>
                            </div>
                            <div className="flex-1 relative max-w-md">
                              <select 
                                value={fontFamily}
                                onChange={(e) => setFontFamily(e.target.value)}
                                className={`w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:${getAccentClass('border')} cursor-pointer pr-10 transition-all`}
                              >
                                <option>Inter</option>
                                <option>Roboto</option>
                                <option>Open Sans</option>
                                <option>Lato</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={18} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                          <button 
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSave}
                            className={`px-6 py-2 ${getAccentClass('bg')} ${getAccentClass('hover')} text-white text-sm font-bold rounded-lg transition-colors`}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : activeSubTab === 'notifications' ? (
                    <div className="space-y-6">
                      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-6">
                          <h3 className="text-lg font-bold text-gray-800">Notification Channels</h3>
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Notifications</h4>
                              {['Weekly reports', 'Security alerts', 'Billing updates'].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">{item}</span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              ))}
                            </div>
                            <div className="h-px bg-gray-100" />
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Push Notifications</h4>
                              {['New messages', 'Task assignments', 'Project updates'].map((item) => (
                                <div key={item} className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-700">{item}</span>
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
                            Save Notification Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : activeSubTab === 'integrations' ? (
                    <div className="space-y-8">
                      {/* Search and Filter */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="Search for integrations..." 
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-500">
                            <option>All Categories</option>
                            <option>Communication</option>
                            <option>Productivity</option>
                            <option>Development</option>
                            <option>Finance</option>
                          </select>
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors">
                            Browse Marketplace
                          </button>
                        </div>
                      </div>

                      {/* Featured Integrations */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Featured Integrations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { name: 'Gmail', desc: 'Manage emails directly', icon: 'https://cdn.worldvectorlogo.com/logos/gmail-icon.svg', color: 'bg-red-50' },
                            { name: 'Slack', desc: 'Team communication', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg', color: 'bg-purple-50' },
                            { name: 'Zoom', desc: 'Video conferencing', icon: 'https://cdn.worldvectorlogo.com/logos/zoom-communications-logo.svg', color: 'bg-blue-50' }
                          ].map((app) => (
                            <div key={app.name} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                              <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <h4 className="text-base font-bold text-gray-800 mb-1">{app.name}</h4>
                              <p className="text-xs text-gray-400 mb-4">{app.desc}</p>
                              <button className="w-full py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                                Connect Now
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* All Integrations */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">All Connections</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'Google Calendar', desc: 'Sync meetings and schedules', icon: 'https://cdn.worldvectorlogo.com/logos/google-calendar-6.svg', connected: true, category: 'Productivity' },
                            { name: 'Jira', desc: 'Track tasks and issues', icon: 'https://cdn.worldvectorlogo.com/logos/jira-1.svg', connected: false, category: 'Development' },
                            { name: 'GitHub', desc: 'Link commits to tasks', icon: 'https://cdn.worldvectorlogo.com/logos/github-icon-1.svg', connected: false, category: 'Development' },
                            { name: 'Trello', desc: 'Visual board management', icon: 'https://cdn.worldvectorlogo.com/logos/trello.svg', connected: true, category: 'Productivity' },
                            { name: 'Microsoft Teams', desc: 'Collaborative workspace', icon: 'https://cdn.worldvectorlogo.com/logos/microsoft-teams-1.svg', connected: false, category: 'Communication' },
                            { name: 'Stripe', desc: 'Payment processing', icon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', connected: false, category: 'Finance' }
                          ].map((app) => (
                            <div key={app.name} className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 border border-gray-100">
                                  <img src={app.icon} alt={app.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-gray-800">{app.name}</p>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md font-bold uppercase">{app.category}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">{app.desc}</p>
                                </div>
                              </div>
                              <button className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${app.connected ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                {app.connected ? 'Disconnect' : 'Connect'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <SettingsIcon size={32} />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 capitalize">{activeSubTab.replace('-', ' ')}</h4>
                      <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8 p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Plans & Billings</h2>
                </div>

                {/* Current Plan Card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">Current Plan</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded uppercase">Monthly</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Basic Plan</h3>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Status :</span>
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">On Trial</span>
                        </div>
                        <div className="flex items-center gap-3 border-l border-gray-100 pl-6">
                          <span className="text-sm text-gray-400">Auto-renewal :</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <p className="text-sm font-medium text-gray-600">Your Trial is Ending On : <span className="text-gray-800 font-bold">27 Jan 2026</span></p>
                      <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <Crown size={16} />
                        Upgrade
                      </button>
                    </div>
                  </div>
                </div>

                {/* Billing Address & Saved Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Billing Address</h3>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Company Name</p>
                        <p className="text-sm font-bold text-gray-800">TechFlow Solutions Inc.</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Address</p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          123 Innovation Drive, Suite 400<br />
                          San Francisco, CA 94103<br />
                          United States
                        </p>
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Pencil size={12} />
                        Edit Address
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800">Saved Cards</h3>
                      <button className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <Plus size={14} />
                        Add New
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Visa Card */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-100 transition-all">
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
                              <img src="https://cdn.worldvectorlogo.com/logos/visa.svg" alt="Visa" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">Visa •••• 1568</p>
                              <p className="text-xs text-gray-400">Exp on 12/25</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">Default</span>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Pencil size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Mastercard */}
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:border-blue-100 transition-all">
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-8 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-1">
                              <img src="https://cdn.worldvectorlogo.com/logos/mastercard-2.svg" alt="Mastercard" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">Mastercard •••• 1279</p>
                              <p className="text-xs text-gray-400">Exp on 10/25</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Set as Default</button>
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                              <Pencil size={16} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Plans Table */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">Billing Plans</h3>
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
                      <Clock size={14} />
                      View Full History
                    </button>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan Name</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Purchase Date</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {[
                          { name: 'Business', amount: '$69', purchase: '15 Jan 2025', end: '15 Jan 2026', status: 'Inprogress', statusColor: 'bg-pink-50 text-pink-600' },
                          { name: 'Basic', amount: '$29', purchase: '15 Jan 2025', end: '15 Jan 2025', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600' },
                          { name: 'Enterprise', amount: '$99', purchase: '15 Jan 2023', end: '15 Jan 2025', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600' },
                          { name: 'Basic', amount: '$29', purchase: '15 Jan 2022', end: '15 Jan 2023', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600' },
                          { name: 'Basic', amount: '$29', purchase: '15 Jan 2021', end: '15 Jan 2022', status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-600' }
                        ].map((plan, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-gray-800">{plan.name}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-400">{plan.amount}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-400">{plan.purchase}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-400">{plan.end}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${plan.statusColor}`}>
                                {plan.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                  Invoice
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
                                  <MoreVertical size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'account' && activeTab !== 'company' && activeTab !== 'work' && activeTab !== 'finance' && activeTab !== 'system' && activeTab !== 'billing' && (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <SettingsIcon size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')} Settings</h4>
                <p className="text-sm text-gray-400 mt-1">This section is currently under development.</p>
              </div>
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
