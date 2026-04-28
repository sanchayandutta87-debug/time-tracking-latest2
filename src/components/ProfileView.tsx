import React, { useState, useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';
import { User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileView = () => {
    const { currentUser, updateProfile, updatePassword } = useAuth();
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Form State — initialized from AuthContext
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

    // Load data from AuthContext when user is available
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

    const handleSave = () => {
        // Handle password change if fields are filled
        if (profileData.newPassword) {
            if (profileData.newPassword !== profileData.confirmPassword) {
                setSaveMessage({ type: 'error', text: 'New passwords do not match!' });
                return;
            }
            if (profileData.newPassword.length < 8) {
                setSaveMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
                return;
            }
            const pwResult = updatePassword(profileData.currentPassword, profileData.newPassword);
            if (!pwResult.success) {
                setSaveMessage({ type: 'error', text: pwResult.error || 'Password update failed.' });
                return;
            }
        }

        // Save profile data to AuthContext + localStorage
        updateProfile({
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

        // Reset password fields
        setProfileData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to discard changes?')) {
            // Reload from AuthContext
            if (currentUser) {
                const nameParts = (currentUser.fullName || '').split(' ');
                setProfileData({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: currentUser.email || '',
                    phone: currentUser.phone || '',
                    address: currentUser.address || '',
                    country: currentUser.country || '',
                    state: currentUser.state || '',
                    city: currentUser.city || '',
                    postalCode: currentUser.postalCode || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setProfileImage(currentUser.avatar || '');
            }
            setSaveMessage(null);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const breadcrumbPaths = [
        { name: 'Home', href: '#' },
        { name: 'Profile', href: '#' }
    ];

    return (
        <div className="max-w-[1400px] mx-auto space-y-6">
                        {/* Header & Breadcrumbs */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                            <Breadcrumbs paths={breadcrumbPaths} />
                        </div>

                        {saveMessage && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${saveMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
                                {saveMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                                <span>{saveMessage.text}</span>
                            </div>
                        )}

                        {/* Profile Form Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden">
                            
                            <div className="p-6 md:p-8 space-y-10">
                                {/* Profile Picture Section */}
                                <section className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Upload profile picture</p>
                                    </div>
                                    <div className="flex-1 flex items-center gap-6">
                                        <div className="relative group">
                                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 dark:border-slate-700">
                                                <img 
                                                    src={profileImage} 
                                                    alt="Profile" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                className="hidden" 
                                                accept="image/*"
                                            />
                                            <button 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                                            >
                                                Change Image
                                            </button>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Recommended size is 80px x 80px</p>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-gray-100 dark:border-slate-700" />

                                {/* Basic Information Section */}
                                <section className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Your personal information</p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="firstName"
                                                value={profileData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="lastName"
                                                value={profileData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Enter phone number"
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-gray-100 dark:border-slate-700" />

                                {/* Address Information Section */}
                                <section className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="w-full md:w-1/4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Address Information</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Your address details</p>
                                    </div>
                                    <div className="flex-1 space-y-6 w-full">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Address <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="address"
                                                value={profileData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                    Country <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    name="country"
                                                    value={profileData.country}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your country"
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                    State <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    name="state"
                                                    value={profileData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your state"
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                    City <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="text"
                                                    name="city"
                                                    value={profileData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your city"
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                    Postal Code <span className="text-red-500">*</span>
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="postalCode"
                                                    value={profileData.postalCode}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-gray-100 dark:border-slate-700" />

                                {/* Change Password Section */}
                                <section className="flex flex-col md:flex-row gap-8 items-start pb-6">
                                    <div className="w-full md:w-1/4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Change Your Password for Enhanced Security</p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Current Password <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.current ? "text" : "password"}
                                                    name="currentPassword"
                                                    value={profileData.currentPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                                                >
                                                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                New Password <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.new ? "text" : "password"}
                                                    name="newPassword"
                                                    value={profileData.newPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('new')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                                                >
                                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 relative">
                                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1">
                                                Confirm Password <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input 
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    name="confirmPassword"
                                                    value={profileData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white pr-10"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                                                >
                                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                                    <button 
                                        onClick={handleCancel}
                                        className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
        </div>
    );
};

export default ProfileView;
