import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Chrome, AlertCircle } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';

const LoginView = ({ onViewChange }: { onViewChange?: (view: string) => void }) => {
    const { login, googleLogin } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const result = await login(formData.email, formData.password);
        setIsLoading(false);
        
        if (result.success) {
            // App.tsx will handle the redirect once AuthContext updates state
        } else {
            setError(result.error || 'Login failed. Please try again.');
        }
    };

    return (
        <AuthLayout 
            title="Login" 
            subtitle="Please enter your details to Login"
        >
            <form onSubmit={handleSubmit} className="auth-stagger space-y-5">
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter your password"
                            className="auth-input w-full pl-4 pr-10 py-2.5 rounded-lg text-white outline-none placeholder:text-gray-600"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                            value={formData.password}
                            onChange={(e) => { setFormData({...formData, password: e.target.value}); setError(''); }}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors duration-200"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded bg-transparent accent-purple-500"
                            style={{
                                border: '1px solid rgba(255,255,255,0.12)',
                            }}
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                        />
                        <span className="text-gray-500 group-hover:text-gray-400 transition-colors duration-200">Remember Me</span>
                    </label>
                    <a href="#" className="auth-link text-purple-400 font-medium hover:text-purple-300">Forgot Password?</a>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="auth-btn-primary w-full py-3 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)',
                        boxShadow: '0 4px 20px rgba(168,85,247,0.25)',
                    }}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : 'Login'}
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 text-xs text-gray-600" style={{ background: 'rgba(12,12,18,0.75)' }}>Or continue with</span>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                    className="auth-btn-google w-full flex justify-center items-center gap-3 py-3 rounded-xl disabled:opacity-50"
                    style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.03)',
                    }}
                >
                    <Chrome className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold text-gray-300">Sign in with Google</span>
                </button>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <button 
                            type="button"
                            onClick={() => onViewChange && onViewChange('register')}
                            className="auth-link text-purple-400 font-semibold hover:text-purple-300"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                <div className="flex justify-center gap-4 text-[10px] text-gray-600 mt-6">
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">Privacy Policy</a>
                    <span className="text-gray-700">·</span>
                    <a href="#" className="hover:text-gray-400 transition-colors duration-200">Terms of Service</a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginView;
