import React, { useState } from 'react';
import { 
  Search, MapPin, Briefcase, Filter, ChevronDown, 
  Bookmark, Star, Sparkles, X, Send, Bot, Building2, 
  GraduationCap, Stethoscope, Calculator, Palette, Wrench
} from 'lucide-react';

// --- Dummy Data ---
const categories = [
  { name: 'IT & Software', icon: <Briefcase size={20} />, count: '1,240' },
  { name: 'Healthcare', icon: <Stethoscope size={20} />, count: '850' },
  { name: 'Finance', icon: <Calculator size={20} />, count: '620' },
  { name: 'Education', icon: <GraduationCap size={20} />, count: '430' },
  { name: 'Engineering', icon: <Wrench size={20} />, count: '910' },
  { name: 'Design', icon: <Palette size={20} />, count: '320' },
];

const jobs = [
  { id: 1, title: 'Senior Software Engineer', company: 'TechNova', location: 'Colombo, LK', type: 'Full-Time', salary: '$80k - $120k', match: 94, time: '2h ago', skills: ['React', 'Node.js', 'AWS'] },
  { id: 2, title: 'Registered Nurse', company: 'CarePlus Hospital', location: 'Kandy, LK', type: 'Full-Time', salary: '$50k - $70k', match: 88, time: '5h ago', skills: ['Patient Care', 'BLS', 'EMR'] },
  { id: 3, title: 'Marketing Executive', company: 'Global Reach', location: 'Remote', type: 'Contract', salary: '$40k - $60k', match: 76, time: '1d ago', skills: ['SEO', 'Content', 'Analytics'] },
  { id: 4, title: 'Financial Analyst', company: 'Vertex Capital', location: 'Colombo, LK', type: 'Full-Time', salary: '$60k - $90k', match: 91, time: '1d ago', skills: ['Excel', 'Financial Modeling'] },
  { id: 5, title: 'Civil Engineer', company: 'BuildRight Construction', location: 'Galle, LK', type: 'Full-Time', salary: '$70k - $100k', match: 82, time: '2d ago', skills: ['AutoCAD', 'Project Management'] },
  { id: 6, title: 'Hotel Manager', company: 'Luxury Stays', location: 'Nuwara Eliya, LK', type: 'Full-Time', salary: '$55k - $85k', match: 79, time: '2d ago', skills: ['Hospitality', 'Operations'] },
];

const GREEN = '#4A7C59';
const INK = '#0F172A';

export default function JobSearchPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
          <Sparkles size={14} /> Powered by JobMart AI
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#0F172A] mb-4 font-serif">
          Find Your <span style={{ color: GREEN }}>Dream Career</span>
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl">
          Explore thousands of verified opportunities across every industry. Our AI matches your skills to the perfect role.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2 max-w-4xl">
          <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-colors">
            <Search size={20} className="text-slate-400 mr-3" />
            <input type="text" placeholder="Job title or skill" className="bg-transparent w-full focus:outline-none text-slate-700" />
          </div>
          <div className="flex-1 flex items-center px-4 py-3 bg-slate-50 rounded-xl border border-transparent focus-within:border-emerald-200 focus-within:bg-white transition-colors">
            <MapPin size={20} className="text-slate-400 mr-3" />
            <input type="text" placeholder="Location" className="bg-transparent w-full focus:outline-none text-slate-700" />
          </div>
          <button 
            className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
            style={{ background: GREEN }}
          >
            Find Matches
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-4 font-mono uppercase tracking-wider">
          scanning 12,500 live roles right now
        </p>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-4 overflow-x-auto no-scrollbar">
          {categories.map((cat, idx) => (
            <button key={idx} className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl border border-slate-200 hover:border-[#4A7C59] hover:shadow-md transition-all group bg-white">
              <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-emerald-50 text-slate-500 group-hover:text-[#4A7C59] transition-colors">
                {cat.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                <p className="text-xs text-slate-500">{cat.count} jobs</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <Filter size={18} className="text-slate-400" />
            </div>

            {/* Filter Group: Job Type */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Job Type</h4>
              <div className="space-y-2.5">
                {['Full-Time', 'Part-Time', 'Contract', 'Remote'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#4A7C59] focus:ring-[#4A7C59]" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Experience */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Experience Level</h4>
              <div className="space-y-2.5">
                {['Entry Level', 'Mid Level', 'Senior', 'Director'].map(level => (
                  <label key={level} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#4A7C59] focus:ring-[#4A7C59]" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Job Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-slate-500 text-sm">Showing <span className="font-semibold text-slate-900">1–12</span> of 4,250 jobs</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                AI Recommended <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-[#4A7C59] transition-colors">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.company}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-[#C9A227] transition-colors">
                    <Bookmark size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{job.location}</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{job.type}</span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">{job.salary}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map(skill => (
                    <span key={skill} className="text-xs font-mono text-slate-500 border border-slate-200 rounded px-2 py-0.5">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-emerald-500 text-emerald-600 font-bold text-xs bg-emerald-50">
                      {job.match}%
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Match Score</span>
                  </div>
                  <button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg"
                    style={{ background: INK }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Panel (from image_49b78c.png reference) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <div className="mb-4 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 flex justify-between items-center text-white" style={{ background: INK }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot size={18} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">JobMart Assistant</h4>
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto bg-slate-50 flex flex-col gap-3">
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 border border-slate-100 w-10/12">
                Hi, I'm the JobMart assistant. Ask me about roles, your match score, or how to strengthen your profile.
              </div>
              <div className="bg-[#4A7C59] p-3 rounded-2xl rounded-tr-sm shadow-sm text-sm text-white self-end w-9/12">
                Help me improve my resume
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 border border-slate-100 w-10/12">
                I can help tighten your resume headline and summary from the Dashboard → AI tab. Want me to take you there?
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about jobs, matches..." 
                className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-700"
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
          style={{ background: GREEN }}
        >
          {chatOpen ? <X size={24} /> : <Sparkles size={24} />}
        </button>
      </div>

    </div>
  );
}