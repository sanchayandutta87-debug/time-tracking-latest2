import React, { useState } from 'react';
import { Mail, Eye, EyeOff, User, Briefcase, Chrome, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';

const RegisterView = ({ onViewChange }: { onViewChange?: (view: string) => void }) => {
    const { register, googleLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPolicy, setShowPolicy] = useState<{type: 'terms' | 'privacy', open: boolean}>({type: 'terms', open: false});
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        jobTitle: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!formData.agreeTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy.');
            return;
        }

        setIsLoading(true);
        
        setTimeout(() => {
            const result = register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                jobTitle: formData.jobTitle,
            });
            
            setIsLoading(false);
            
            if (result.success) {
                setSuccess('Account created successfully! Redirecting...');
                setTimeout(() => {
                    if (onViewChange) onViewChange('admin-dashboard');
                }, 1000);
            } else {
                setError(result.error || 'Registration failed.');
            }
        }, 800);
    };

    const handleGoogleSignUp = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsLoading(true);
            setError('');
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                
                const fakeJwt = btoa(JSON.stringify({})) + '.' + btoa(JSON.stringify({
                    name: userInfo.name,
                    email: userInfo.email,
                    picture: userInfo.picture,
                })) + '.signature';
                
                const result = googleLogin(fakeJwt);
                setIsLoading(false);
                
                if (result.success) {
                    setSuccess(`Welcome, ${userInfo.name}! Redirecting...`);
                    setTimeout(() => {
                        if (onViewChange) onViewChange('admin-dashboard');
                    }, 1000);
                } else {
                    setError(result.error || 'Google sign-up failed.');
                }
            } catch {
                setIsLoading(false);
                setError('Failed to connect to Google. Please try again.');
            }
        },
        onError: () => {
            setError('Google sign-up was cancelled or failed.');
        },
    });

    return (
        <AuthLayout 
            title="Sign Up" 
            subtitle="Please enter your details to Create Account"
        >
            <div className="relative">
                <form onSubmit={handleSubmit} className={`space-y-4 transition-all duration-300 ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 animate-shake">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Full Name</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                required
                                placeholder="Enter your full name"
                                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={formData.fullName}
                                onChange={(e) => { setFormData({...formData, fullName: e.target.value}); setError(''); }}
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                            <input 
                                type="email" 
                                required
                                placeholder="Enter your email"
                                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={formData.email}
                                onChange={(e) => { setFormData({...formData, email: e.target.value}); setError(''); }}
                            />
                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Job Title (Optional)</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="e.g. Software Engineer"
                                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                value={formData.jobTitle}
                                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                            />
                            <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="Min 8 characters"
                                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    value={formData.password}
                                    onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(''); }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Confirm</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder="Repeat password"
                                    className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    value={formData.confirmPassword}
                                    onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); setError(''); }}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                        <input 
                            type="checkbox" 
                            id="agreeTerms"
                            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={formData.agreeTerms}
                            onChange={(e) => { setFormData({...formData, agreeTerms: e.target.checked}); setError(''); }}
                        />
                        <label htmlFor="agreeTerms" className="text-sm text-gray-600 dark:text-slate-400 leading-tight cursor-pointer">
                            I agree to the <button type="button" onClick={() => setShowPolicy({type: 'terms', open: true})} className="text-blue-600 hover:underline font-medium">Terms of Service</button> and <button type="button" onClick={() => setShowPolicy({type: 'privacy', open: true})} className="text-blue-600 hover:underline font-medium">Privacy Policy</button>
                        </label>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : 'Sign Up'}
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 uppercase tracking-widest font-bold">Or Sign Up With</span>
                        </div>
                    </div>

                    <button 
                        type="button" 
                        onClick={() => handleGoogleSignUp()}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] disabled:opacity-50"
                    >
                        <Chrome className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-bold dark:text-white">Sign up with Google</span>
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <button 
                                type="button"
                                onClick={() => onViewChange && onViewChange('login')}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </form>

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-white/20 dark:border-slate-800">
                            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-bold dark:text-white">Processing...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Policy Modal */}
            {showPolicy.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold dark:text-white">{showPolicy.type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h3>
                            <button onClick={() => setShowPolicy({...showPolicy, open: false})} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <X className="w-5 h-5 dark:text-white" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                            {showPolicy.type === 'terms' ? (
                                <div className="space-y-4">
                                    <p className="font-bold text-gray-900 dark:text-white text-base">1. Acceptance of Terms</p>
                                    <p>By creating an account, you agree to abide by all platform rules and security guidelines. This platform is designed for professional time tracking and workforce management.</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-base">2. User Responsibilities</p>
                                    <p>You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="font-bold text-gray-900 dark:text-white text-base">Data Collection</p>
                                    <p>We collect minimal data including your name, email, and job title to personalize your dashboard experience.</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-base">Data Usage</p>
                                    <p>Your tracking data is encrypted and only accessible by authorized administrators. We never sell your personal information.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                            <button onClick={() => setShowPolicy({...showPolicy, open: false})} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default RegisterView;
