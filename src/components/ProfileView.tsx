import React, { useState, useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { 
  User, Eye, EyeOff, CheckCircle2, AlertCircle, 
  MapPin, Phone, Mail, ShieldCheck, Camera,
  Briefcase, Globe, Landmark, Hash, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileView = () => {
    const { currentUser, updateProfile, updatePassword } = useAuth();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');

    // Form State
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [profileImage, setProfileImage] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser) {
            const nameParts = (currentUser.fullName || '').split(' ');
            setProfileData(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                country: currentUser.country || '',
                state: currentUser.state || '',
                city: currentUser.city || '',
                postalCode: currentUser.postalCode || '',
            }));
            setProfileImage(currentUser.avatar || '');
        }
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        setSaveMessage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaveMessage(null);
        if (profileData.newPassword) {
            if (profileData.newPassword !== profileData.confirmPassword) {
                setSaveMessage({ type: 'error', text: 'New passwords do not match!' });
                return;
            }
            if (profileData.newPassword.length < 8) {
                setSaveMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
                return;
            }
            const pwResult = await updatePassword(profileData.newPassword);
            if (!pwResult.success) {
                setSaveMessage({ type: 'error', text: pwResult.error || 'Password update failed.' });
                return;
            }
        }

        try {
            const result = await updateProfile({
                fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
                email: profileData.email,
                phone: profileData.phone,
                address: profileData.address,
                country: profileData.country,
                state: profileData.state,
                city: profileData.city,
                postalCode: profileData.postalCode,
                avatar: profileImage,
            });

            if (result && !result.success) {
                setSaveMessage({ type: 'error', text: result.error || 'Failed to update profile.' });
                return;
            }

            setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setSaveMessage(null), 5000);
        } catch (err: any) {
            setSaveMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
        }
    };

    const breadcrumbPaths = [
        { name: 'Home', href: '#' },
        { name: 'Profile', href: '#' }
    ];

    const inputClasses = "w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white backdrop-blur-sm placeholder-gray-400 dark:placeholder-gray-600";
    const labelClasses = "text-[11px] uppercase tracking-wider font-black text-gray-400 dark:text-gray-500 mb-1.5 block ml-1";

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Manage your personal information and security preferences</p>
                </div>
                <Breadcrumbs paths={breadcrumbPaths} />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Sidebar / Quick Info */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Profile Header Card */}
                    <div className="bg-white dark:bg-black backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-500/5 transition-all">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                             <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        </div>
                        <div className="px-6 pb-8 -mt-12 text-center relative z-10">
                            <div className="relative inline-block group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-blue-600 mx-auto flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-3xl font-black">{(profileData.firstName || 'U').charAt(0)}</span>
                                    )}
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 p-2.5 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:scale-110 active:scale-95 group-hover:rotate-6"
                                >
                                    <Camera size={16} strokeWidth={2.5} />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                            </div>
                            
                            <div className="mt-4">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                    {profileData.firstName} {profileData.lastName}
                                </h2>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-widest">{currentUser?.role || 'Employee'}</p>
                            </div>

                            <div className="mt-8 flex flex-col gap-3">
                                <button 
                                    onClick={() => setActiveTab('personal')}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'personal' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <User size={18} /> Personal Info
                                </button>
                                <button 
                                    onClick={() => setActiveTab('security')}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    <ShieldCheck size={18} /> Security & Passwords
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats/Badges */}
                    <div className="p-6 bg-blue-600/5 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-blue-600/60 dark:text-blue-400/60 tracking-wider leading-none mb-1">Experience</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">2.4 Years</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/20">
                                <Landmark size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-purple-600/60 dark:text-purple-400/60 tracking-wider leading-none mb-1">Department</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white leading-none">Development Team</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {saveMessage && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-slide-up border ${saveMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400'}`}>
                            {saveMessage.type === 'success' ? <CheckCircle2 size={18} strokeWidth={3} /> : <AlertCircle size={18} strokeWidth={3} />}
                            <p className="text-sm font-bold tracking-tight">{saveMessage.text}</p>
                        </div>
                    )}

                    <div className="bg-white dark:bg-black backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 min-h-[600px]">
                        
                        {activeTab === 'personal' && (
                            <div className="space-y-10 animate-fade-in">
                                {/* Basic Info */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <Briefcase size={18} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Basic Information</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClasses}>First Name</label>
                                            <input name="firstName" value={profileData.firstName} onChange={handleInputChange} className={inputClasses} placeholder="First name" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Last Name</label>
                                            <input name="lastName" value={profileData.lastName} onChange={handleInputChange} className={inputClasses} placeholder="Last name" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Email Address</label>
                                            <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className={inputClasses} placeholder="email@example.com" />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Phone Number</label>
                                            <input type="tel" name="phone" value={profileData.phone} onChange={handleInputChange} className={inputClasses} placeholder="+1 (555) 000-0000" />
                                        </div>
                                    </div>
                                </section>

                                {/* Location Info */}
                                <section className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                            <MapPin size={18} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Location Details</h3>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <label className={labelClasses}>Full Address</label>
                                            <input name="address" value={profileData.address} onChange={handleInputChange} className={inputClasses} placeholder="Street address, Apartment, Suite" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className={labelClasses}>Country</label>
                                                <input name="country" value={profileData.country} onChange={handleInputChange} className={inputClasses} placeholder="Country" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>City / State</label>
                                                <div className="flex gap-2">
                                                    <input name="city" value={profileData.city} onChange={handleInputChange} className={inputClasses} placeholder="City" />
                                                    <input name="state" value={profileData.state} onChange={handleInputChange} className={inputClasses} placeholder="State" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Postal Code</label>
                                                <input name="postalCode" value={profileData.postalCode} onChange={handleInputChange} className={inputClasses} placeholder="10001" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-10 animate-fade-in">
                                <section className="space-y-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Update Password</h3>
                                    </div>
                                    
                                    <div className="max-w-md space-y-6">
                                        <div className="relative">
                                            <label className={labelClasses}>Current Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.current ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={profileData.currentPassword}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                                <button onClick={() => togglePasswordVisibility('current')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600">
                                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="h-px bg-gray-100 dark:bg-gray-800" />

                                        <div className="relative">
                                            <label className={labelClasses}>New Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.new ? "text" : "password"}
                                                    name="newPassword"
                                                    value={profileData.newPassword}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                                <button onClick={() => togglePasswordVisibility('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600">
                                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <label className={labelClasses}>Confirm New Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={profileData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className={inputClasses}
                                                />
                                                <button onClick={() => togglePasswordVisibility('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-600">
                                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        <div className="mt-12 flex items-center justify-end gap-4 animate-slide-up">
                            <button className="px-8 py-4 rounded-2xl text-sm font-black text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-3"
                            >
                                <Settings size={18} className="animate-spin-slow" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
