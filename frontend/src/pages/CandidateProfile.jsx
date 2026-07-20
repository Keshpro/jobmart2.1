import React, { useEffect, useState } from 'react';
import { candidateService } from '../../services/candidateService';

export default function CandidateProfile() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    skills: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await candidateService.getProfile();
      if (data) {
        setProfile({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          skills: data.skills || '',
        });
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      setMessage({ type: 'error', text: 'Failed to load profile details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await candidateService.updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error("Error updating profile", err);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      setMessage({ type: '', text: '' });
      await candidateService.uploadResume(formData);
      setMessage({ type: 'success', text: 'Resume uploaded successfully to Supabase!' });
    } catch (err) {
      console.error("Error uploading resume", err);
      setMessage({ type: 'error', text: 'Failed to upload resume file.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-300 bg-slate-900 min-h-screen">Loading profile...</div>;
  }

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Candidate Profile Settings</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Details Form */}
        <form onSubmit={handleUpdateProfile} className="md:col-span-2 space-y-6 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Professional Summary / Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={profile.bio}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="e.g. C#, .NET Core, React, SQL Server"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>

        {/* Resume Upload Section */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Resume Document</h2>
            <p className="text-sm text-slate-400 mb-4">Upload your latest resume (PDF or DOCX) to attach when applying for jobs.</p>
            
            <label className="block w-full border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-900/50">
              <span className="text-sm text-slate-300 font-medium block mb-1">
                {uploading ? 'Uploading to Supabase...' : 'Click to upload resume'}
              </span>
              <span className="text-xs text-slate-500">PDF, DOCX up to 5MB</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}