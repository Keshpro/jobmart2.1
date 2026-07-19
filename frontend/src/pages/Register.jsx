import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link එක මෙතනට එකතු කර ඇත
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
        <div className="flex justify-center items-center min-h-screen bg-neutral-950 text-white p-4">
            <form 
                onSubmit={handleRegister} 
                className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-[0_0_20px_rgba(220,38,38,0.2)] w-full max-w-sm"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-white">
                    Create <span className="text-red-600">Account</span>
                </h2>
                
                <div className="space-y-4">
                    <input 
                        type="text" placeholder="Username" required
                        className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg focus:border-red-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                    <input 
                        type="email" placeholder="Email" required
                        className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg focus:border-red-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-lg focus:border-red-600 outline-none transition"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold transition duration-300 disabled:opacity-50 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                >
                    {isLoading ? "Registering..." : "Register Now"}
                </button>

                {/* මෙතන තමයි Link එක පාවිච්චි වෙන්නේ */}
                <p className="mt-6 text-center text-sm text-neutral-400">
                    Already have an account? <Link to="/login" className="text-red-500 hover:underline">Log in here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;