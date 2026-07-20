import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api'; // Ensure correct path to your axios instance
import { 
  LayoutDashboard, Search, Briefcase, FileText, Bell, 
  UploadCloud, BrainCircuit, CheckCircle, Clock, XCircle, 
  ChevronRight, Settings, LogOut, Sparkles, Bot, X, Send, User, AlertCircle
} from 'lucide-react';

const GREEN = '#4A7C59';
const INK = '#0F172A';

export default function CandidateDashboard() {
  // --- States for Real Data ---
  const [username, setUsername] = useState(localStorage.getItem('username') || 'Candidate');
  const [kpis, setKpis] = useState({ applied: 0, pending: 0, interviews: 0, rejections: 0 });
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- Custom Beautiful Toast Notification State ---
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000); // Auto-hide after 4 seconds
  };

  // --- Fetch Dashboard Data ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Replace these endpoints with your actual backend routes
        
        // 1. Fetch Profile Data (for updated username and skills)
        const profileRes = await api.get('/api/candidate/profile');
        if (profileRes.data?.username) setUsername(profileRes.data.username);
        if (profileRes.data?.skills) setExtractedSkills(profileRes.data.skills);

        // 2. Fetch KPIs
        const kpiRes = await api.get('/api/candidate/kpis');
        if (kpiRes.data) setKpis(kpiRes.data);

        // 3. Fetch Recent Applications
        const appsRes = await api.get('/api/candidate/applications/recent');
        if (appsRes.data) setRecentApplications(appsRes.data);

        // 4. Fetch AI Recommended Jobs
        const jobsRes = await api.get('/api/ai/recommendations');
        if (jobsRes.data) setRecommendedJobs(jobsRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showNotification("Failed to load some dashboard data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Handle CV Upload ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      setIsUploading(true);
      
      // Call Backend API to upload to Supabase and Parse via AI
      const response = await api.post('/api/candidate/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.skills) {
        setExtractedSkills(response.data.skills); // Update skills from AI parsing
      }
      
      showNotification("CV Uploaded and Parsed by AI successfully!", "success");
    } catch (error) {
      console.error("Error uploading CV:", error);
      showNotification(error.response?.data?.message || "Failed to upload CV. Try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans relative">
      
      {/* --- Beautiful Custom Toast Notification --- */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-top-5 fade-in ${
          toast.type === 'success' ? 'bg-[#4A7C59] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
          <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 opacity-80 hover:opacity-100">
            <X size={18} />
          </button>
        </div>
      )}

      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-10 relative">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${GREEN}, #2F5B3F)` }}>
              <Briefcase size={18} strokeWidth={2} />
            </div>
            <span className="text-xl font-bold tracking-tight font-serif" style={{ color: INK }}>
              Job<span style={{ color: GREEN }}>Mart</span>
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#4A7C59]/10 text-[#4A7C59] font-medium transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Search size={20} /> Find Jobs
          </Link>
          <Link to="/applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <FileText size={20} /> My Applications
          </Link>
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <User size={20} /> Profile & CV
          </Link>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Settings size={20} /> Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors mt-1">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* 2. Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 sticky top-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {username}! 👋</h1>
            <p className="text-sm text-slate-500">Here is your career overview and AI recommendations.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-[#4A7C59] hover:bg-[#4A7C59]/10 rounded-full transition-colors relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
              <span className="font-bold text-slate-500">{username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-[#4A7C59] font-medium">
              <BrainCircuit className="animate-pulse mr-2" size={24} /> Loading your dashboard...
            </div>
          ) : (
            <>
              {/* 3. KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500"><Briefcase size={24} /></div>
                  <div><p className="text-sm font-medium text-slate-500">Total Applied</p><h3 className="text-2xl font-bold text-slate-900">{kpis.applied}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-yellow-50 text-yellow-500"><Clock size={24} /></div>
                  <div><p className="text-sm font-medium text-slate-500">Pending Review</p><h3 className="text-2xl font-bold text-slate-900">{kpis.pending}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#4A7C59]/10 text-[#4A7C59]"><CheckCircle size={24} /></div>
                  <div><p className="text-sm font-medium text-slate-500">Interviews</p><h3 className="text-2xl font-bold text-slate-900">{kpis.interviews}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-red-50 text-red-500"><XCircle size={24} /></div>
                  <div><p className="text-sm font-medium text-slate-500">Rejections</p><h3 className="text-2xl font-bold text-slate-900">{kpis.rejections}</h3></div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* 4. AI Resume Parsing & CV Uploader */}
                <div className="xl:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">Your Resume</h3>
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md flex items-center gap-1 border border-blue-100">
                        <Sparkles size={12} /> AI Analyzed
                      </span>
                    </div>
                    
                    {/* Drag & Drop Uploader */}
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#4A7C59] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 mb-6 group relative overflow-hidden">
                      <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={isUploading} />
                      {isUploading ? (
                        <div className="flex flex-col items-center text-[#4A7C59]">
                          <BrainCircuit size={32} className="mb-2 animate-pulse" />
                          <span className="text-sm font-medium">AI is parsing your CV...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-slate-400 group-hover:text-[#4A7C59] mb-3 transition-colors" />
                          <span className="text-sm font-medium text-slate-700">Click to upload new CV</span>
                          <span className="text-xs text-slate-400 mt-1">PDF or DOCX (Max 5MB)</span>
                        </>
                      )}
                    </label>

                    {/* AI Skills Extraction */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <BrainCircuit size={16} className="text-[#4A7C59]" /> Extracted Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {extractedSkills.length > 0 ? extractedSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                            {skill}
                          </span>
                        )) : (
                          <p className="text-sm text-slate-400">Upload your CV to extract skills.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. AI Recommended Jobs */}
                <div className="xl:col-span-2">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Sparkles size={20} className="text-[#C9A227]" /> Top AI Recommendations
                        </h3>
                        <p className="text-sm text-slate-500">Based on your extracted skills and profile</p>
                      </div>
                      <Link to="/jobs" className="text-sm font-medium text-[#4A7C59] hover:underline flex items-center">
                        View all <ChevronRight size={16} />
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
                        <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#4A7C59]/30 hover:shadow-md transition-all bg-slate-50/50 group">
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                              <Briefcase size={20} className="text-slate-400 group-hover:text-[#4A7C59]" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{job.title}</h4>
                              <p className="text-sm text-slate-500">{job.companyName} • {job.location} • {job.jobType}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full border-4 border-[#4A7C59] flex items-center justify-center bg-white shadow-sm">
                                <span className="text-xs font-bold text-[#4A7C59]">{job.matchScore}%</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold mt-1 uppercase tracking-wide">Match</span>
                            </div>
                            <button className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 shadow-md" style={{ background: INK }}>
                              Apply
                            </button>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                          Upload your resume to get AI personalized job matches.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* 6. Notifications and Interview Updates (Recent Applications) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Applications & Updates</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 font-semibold">Role</th>
                        <th className="pb-3 font-semibold">Company</th>
                        <th className="pb-3 font-semibold">Applied Date</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.length > 0 ? recentApplications.map((app) => (
                        <tr key={app.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-900">{app.jobTitle}</td>
                          <td className="py-4 text-slate-600">{app.companyName}</td>
                          <td className="py-4 text-slate-500 text-sm">{new Date(app.appliedDate).toLocaleDateString()}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                app.status === 'Interview' ? 'text-[#4A7C59] bg-[#4A7C59]/10' :
                                app.status === 'Rejected' ? 'text-red-600 bg-red-50' : 
                                'text-yellow-600 bg-yellow-50'
                              }`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button className="text-sm font-medium text-[#4A7C59] hover:underline">View Details</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-500">You haven't applied to any jobs yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* 7. Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="mb-4 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
            <div className="p-4 flex justify-between items-center text-white" style={{ background: INK }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot size={18} className="text-[#4A7C59]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Career Assistant</h4>
                  <p className="text-xs text-[#4A7C59] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C59]"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto bg-slate-50 flex flex-col gap-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 border border-slate-100 w-10/12">
                Hi {username}! Your resume is looking strong. Want me to suggest jobs that match your skills or review interview tips?
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask your AI assistant..." 
                className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 text-slate-700"
              />
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-105" style={{ background: INK }}>
                <Send size={16} />
              </button>
            </div>
          </div>
        )}

        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110"
          style={{ background: GREEN, boxShadow: '0 8px 20px -8px rgba(74,124,89,0.6)' }}
        >
          {chatOpen ? <X size={24} /> : <Bot size={24} />}
        </button>
      </div>

    </div>
  );
}