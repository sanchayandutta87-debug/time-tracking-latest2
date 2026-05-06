import React, { useState } from 'react';
import { Mail, Eye, EyeOff, User, Briefcase, Chrome, X, AlertCircle, CheckCircle2 } from 'lucide-react';
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

    const handleSubmit = async (e: React.FormEvent) => {
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
        
        const result = await register({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            jobTitle: formData.jobTitle,
        });
        
        setIsLoading(false);
        
        if (result.success) {
            setSuccess('Account created successfully! Redirecting...');
        } else {
            setError(result.error || 'Registration failed.');
        }
    };

    return (
        <AuthLayout 
            title="Sign Up" 
            subtitle="Create your Employee Management account"
        >
            <form onSubmit={handleSubmit} className="auth-stagger space-y-4">
                {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg text-sm text-red-400"
                        style={{
                            background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.15)',
                        }}
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg text-sm text-green-400"
                        style={{
                            background: 'rgba(16,185,129,0.08)',
                            border: '1px solid rgba(16,185,129,0.15)',
                        }}
                    >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            required
                            placeholder="Enter your full name"
                            className="auth-input w-full pl-4 pr-10 py-2.5 rounded-lg text-white outline-none placeholder:text-gray-600"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            value={formData.fullName}
                            onChange={(e) => { setFormData({...formData, fullName: e.target.value}); setError(''); }}
                        />
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            required
                            placeholder="Enter your email"
                            className="auth-input w-full pl-4 pr-10 py-2.5 rounded-lg text-white outline-none placeholder:text-gray-600"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            value={formData.email}
                            onChange={(e) => { setFormData({...formData, email: e.target.value}); setError(''); }}
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-400">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Min 8 chars"
                                className="auth-input w-full pl-4 pr-10 py-2.5 rounded-lg text-white outline-none placeholder:text-gray-600"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                value={formData.password}
                                onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(''); }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-400">Confirm</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                placeholder="Repeat it"
                                className="auth-input w-full pl-4 pr-10 py-2.5 rounded-lg text-white outline-none placeholder:text-gray-600"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                value={formData.confirmPassword}
                                onChange={(e) => { setFormData({...formData, confirmPassword: e.target.value}); setError(''); }}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
                                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                    <input 
                        type="checkbox" 
                        id="agreeTerms"
                        className="mt-1 w-4 h-4 rounded bg-transparent accent-purple-500"
                        style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                        checked={formData.agreeTerms}
                        onChange={(e) => { setFormData({...formData, agreeTerms: e.target.checked}); setError(''); }}
                    />
                    <label htmlFor="agreeTerms" className="text-xs text-gray-500 leading-tight">
                        I agree to the <button type="button" onClick={() => setShowPolicy({type: 'terms', open: true})} className="text-purple-400 hover:underline">Terms</button> and <button type="button" onClick={() => setShowPolicy({type: 'privacy', open: true})} className="text-purple-400 hover:underline">Privacy Policy</button>
                    </label>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="auth-btn-primary w-full py-3 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)',
                        boxShadow: '0 4px 20px rgba(168,85,247,0.25)',
                    }}
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
                </button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}></div></div>
                    <div className="relative flex justify-center"><span className="px-3 text-[10px] text-gray-600" style={{ background: 'rgba(12,12,18,0.75)' }}>OR</span></div>
                </div>

                <button 
                    type="button"
                    onClick={() => googleLogin()}
                    className="auth-btn-google w-full flex justify-center items-center gap-3 py-3 rounded-xl"
                    style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                    }}
                >
                    <Chrome className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-gray-300">Sign up with Google</span>
                </button>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <button type="button" onClick={() => onViewChange && onViewChange('login')} className="auth-link text-purple-400 font-semibold">Sign In</button>
                    </p>
                </div>
            </form>

            {/* Policy Modal Overlay */}
            {showPolicy.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-card w-full max-w-lg rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">{showPolicy.type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h3>
                            <button onClick={() => setShowPolicy({...showPolicy, open: false})} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto text-sm text-gray-400 leading-relaxed">
                            {showPolicy.type === 'terms' ? (
                                <div className="space-y-4">
                                    <p className="font-bold text-white">1. Acceptance</p>
                                    <p>By using Employee Management, you agree to these terms.</p>
                                    <p className="font-bold text-white">2. Usage</p>
                                    <p>This platform is for professional workforce tracking only.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="font-bold text-white">Data Security</p>
                                    <p>We use industry-standard encryption to protect your data.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-white/5 flex justify-end">
                            <button onClick={() => setShowPolicy({...showPolicy, open: false})} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default RegisterView;
