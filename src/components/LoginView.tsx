import React, { useState } from 'react';
import { Mail, Eye, EyeOff, Chrome, AlertCircle, CheckCircle2 } from 'lucide-react';
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
            if (onViewChange) {
                const mode = localStorage.getItem('dashboardMode') || 'admin';
                onViewChange(mode === 'user' ? 'user-dashboard' : 'admin-dashboard');
            }
        } else {
            setError(result.error || 'Login failed. Please try again.');
        }
    };

    return (
        <AuthLayout 
            title="Login" 
            subtitle="Please enter your details to Login"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Email</label>
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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Password</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Enter your password"
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

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.rememberMe}
                            onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                        />
                        <span className="text-gray-600 dark:text-slate-400">Remember Me</span>
                    </label>
                    <a href="#" className="text-blue-600 font-medium hover:underline transition-colors">Forgot Password?</a>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Login'}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-900 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button 
                    type="button"
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-3 py-3 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                    <Chrome className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-bold dark:text-white">Sign in with Google</span>
                </button>




                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <button 
                            type="button"
                            onClick={() => onViewChange && onViewChange('register')}
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                <div className="flex justify-center gap-4 text-[10px] text-gray-400 mt-8">
                    <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-600">Terms of Service</a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginView;
