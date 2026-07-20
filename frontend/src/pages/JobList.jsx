import React, { useEffect, useState } from 'react';
import { jobService } from '../../services/jobService';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ title: searchTerm });
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(true);
      setMessage({ type: '', text: '' });
      await jobService.applyForJob({ jobId });
      setMessage({ type: 'success', text: 'Successfully applied for the job!' });
    } catch (err) {
      console.error("Error applying for job", err);
      setMessage({ type: 'error', text: 'Failed to submit application. Try again.' });
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-100 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Open Roles</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Search Filter Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by job title or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          Search
        </button>
      </form>

      {/* Job Grid / Details layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Cards List */}
        <div className="md:col-span-1 space-y-4">
          {loading ? (
            <p className="text-slate-400">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-slate-400">No jobs found.</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedJob?.id === job.id ? 'bg-slate-800 border-emerald-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
              >
                <h3 className="font-semibold text-lg text-slate-100">{job.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{job.companyName}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{job.location}</span>
                  <span className="text-emerald-400 font-medium">{job.jobType}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Job Details View */}
        <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
          {selectedJob ? (
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
              <p className="text-emerald-400 font-medium mb-4">{selectedJob.companyName} • {selectedJob.location}</p>
              
              <div className="border-t border-slate-700 pt-4 my-4">
                <h4 className="font-semibold text-slate-300 mb-2">Job Description</h4>
                <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="border-t border-slate-700 pt-4 my-4">
                <h4 className="font-semibold text-slate-300 mb-2">Requirements</h4>
                <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed">{selectedJob.requirements}</p>
              </div>

              <button
                onClick={() => handleApply(selectedJob.id)}
                disabled={applying}
                className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {applying ? 'Submitting Application...' : 'Apply Now'}
              </button>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              Select a job from the list to view full description and apply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}