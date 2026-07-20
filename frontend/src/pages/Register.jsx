import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../api'; // Ensure this path is correct based on your project structure

const GREEN = '#4A7C59';
const INK = '#0F172A';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await api.post('/api/auth/register', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            navigate('/dashboard');
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                alert(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
            } else {
                alert("Server unreachable. Ensure your Backend is running.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#4A7C59] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0F172A] rounded-full mix-blend-multiply filter blur-[128px] opacity-10"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2.5 group mb-8">
                    <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)`, boxShadow: '0 4px 14px 0 rgba(74, 124, 89, 0.3)' }}
                    >
                        <Briefcase size={26} strokeWidth={2} />
                    </div>
                    <span className="text-3xl font-bold tracking-tight font-serif" style={{ color: INK }}>
                        Job<span style={{ color: GREEN }}>Mart</span>
                    </span>
                </Link>

                <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-500">
                    Join thousands of professionals finding their dream jobs.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10">
                <div className="bg-white py-8 px-4 shadow-2xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-5" onSubmit={handleRegister}>
                        
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-colors sm:text-sm"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-colors sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 focus:border-[#4A7C59] transition-colors sm:text-sm"
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#4A7C59] transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A7C59] disabled:opacity-70 disabled:hover:translate-y-0"
                                style={{ background: GREEN, boxShadow: '0 8px 20px -8px rgba(74,124,89,0.6)' }}
                            >
                                {isLoading ? "Registering..." : (
                                    <>Create Account <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500 font-medium">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        {/* Login Link Button */}
                        <div className="mt-6">
                            <Link
                                to="/login"
                                className="w-full flex justify-center py-3 px-4 border-2 rounded-xl text-sm font-bold bg-white transition-colors hover:bg-slate-50"
                                style={{ color: INK, borderColor: '#E2E8F0' }}
                            >
                                Log in here
                            </Link>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Register;