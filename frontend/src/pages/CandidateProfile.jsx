import React, { useEffect, useState } from 'react';
import api from '../api';
import UploadResume from './UploadResume';

const CandidateProfile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // GET request එක හරහා database එකෙන් profile දත්ත ගන්න
                const res = await api.get('/api/Candidate/profile');
                setProfile(res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    if (!profile) return <div className="text-white p-10">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-10">
            <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-red-500 mb-6">Candidate Profile</h1>
                
                <div className="space-y-4">
                    <p><span className="text-neutral-400">Name:</span> {profile.fullName}</p>
                    <p><span className="text-neutral-400">Email:</span> {profile.email}</p>
                    <p><span className="text-neutral-400">Phone:</span> {profile.phoneNumber}</p>
                </div>

                <div className="mt-8">
                    <UploadResume />
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;