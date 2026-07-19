import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await api.post('/api/auth/login', formData);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            }
        } catch (error) {
            setIsLoading(false);
            if (error.response) {
                alert(`Error: ${error.response.data.message || "Invalid credentials"}`);
            } else {
                alert("Server unreachable. Please check your connection.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-white p-4">
            <form 
                onSubmit={handleLogin} 
                className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-[0_0_20px_rgba(220,38,38,0.2)] w-full max-w-sm"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
                    Welcome <span className="text-red-600">Back</span>
                </h2>
                
                <div className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        required
                        className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg focus:border-red-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        required
                        className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg focus:border-red-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold transition duration-300 disabled:opacity-50 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                >
                    {isLoading ? "Logging in..." : "Log In"}
                </button>

                {/* Register page එකට යන්න link එකක් */}
                <p className="mt-6 text-center text-sm text-neutral-400">
                    Don't have an account? <Link to="/register" className="text-red-500 hover:underline">Register here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;