import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import UploadResume from '../components/UploadResume';

const Dashboard = () => {
    const [candidate, setCandidate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Token එක තිබේදැයි පරීක්ෂා කිරීම (නැත්නම් Register එකට හරවා යවන්න)
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/register');
                    return;
                }

                const res = await api.get('/api/candidate/profile');
                setCandidate(res.data);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/register');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex justify-center items-center">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
            {/* Navigation Bar */}
            <nav className="bg-neutral-900 border-b border-neutral-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
                <div className="text-2xl font-bold tracking-wider">
                    RECRUIT<span className="text-red-600">PRO</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-neutral-400 hover:text-red-500 transition font-medium text-sm border border-neutral-700 hover:border-red-600 px-4 py-2 rounded-lg"
                >
                    Log Out
                </button>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-10">
                
                <header className="mb-10">
                    <h1 className="text-4xl font-extrabold mb-2">
                        Welcome back, <span className="text-yellow-500">{candidate?.fullName || candidate?.username || 'Candidate'}</span>
                    </h1>
                    <p className="text-neutral-400">Manage your profile, resume, and job applications all in one place.</p>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Left Column (Profile Info) */}
                    <div className="md:col-span-1 space-y-8">
                        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-600"></span> Profile Details
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Full Name</p>
                                    <p className="font-medium">{candidate?.fullName || candidate?.username || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Email Address</p>
                                    <p className="font-medium text-neutral-300">{candidate?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider">Phone</p>
                                    <p className="font-medium text-neutral-300">{candidate?.phone || 'Not Provided'}</p>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-neutral-800 hover:bg-neutral-700 text-sm py-2 rounded-lg transition text-neutral-300">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Right Column (Resume & Action Widgets) */}
                    <div className="md:col-span-2 space-y-8">
                        
                        {/* Resume Upload Section */}
                        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl"></div>
                            
                            <h2 className="text-xl font-bold text-white mb-2">Resume / CV</h2>
                            <p className="text-sm text-neutral-400 mb-6">Upload your most recent resume to stand out to employers.</p>
                            
                            <UploadResume existingResume={candidate?.resume} />
                        </div>

                        {/* Dummy Status Section (UI Enhancement) */}
                        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                            <h2 className="text-xl font-bold text-white mb-4">Active Applications</h2>
                            
                            <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                                <div>
                                    <h3 className="font-bold text-neutral-200">Senior Frontend Developer</h3>
                                    <p className="text-sm text-neutral-500">TechCorp Inc.</p>
                                </div>
                                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs rounded-full font-medium">
                                    Under Review
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;