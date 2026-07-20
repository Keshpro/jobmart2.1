import api from './api';

export const jobService = {
  // Get all jobs with optional filters (title, location, tech stack, etc.)
  getJobs: async (filters) => {
    const response = await api.get('/jobs', { params: filters });
    return response.data;
  },

  // Get single job details by ID
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Apply for a specific job
  applyForJob: async (applicationData) => {
    const response = await api.post('/jobs/apply', applicationData);
    return response.data;
  },

  // Fetch AI match score for a job posting
  getMatchScore: async (jobId) => {
    const response = await api.get(`/ai/match-score/${jobId}`);
    return response.data;
  }
};