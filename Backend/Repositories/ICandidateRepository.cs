using Backend.Models; // Oyage Models thiyena namespace eka
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface ICandidateRepository
    {
        // Profile Management
        Task<Candidate> GetCandidateByUserIdAsync(string userId);
        Task<bool> UpdateCandidateProfileAsync(Candidate candidate);
        Task<bool> UpdateResumeDetailsAsync(int candidateId, string resumeUrl, string extractedSkills);

        // Dashboard KPIs & Data
        Task<CandidateKpiDto> GetDashboardKpisAsync(int candidateId);
        Task<IEnumerable<RecentApplicationDto>> GetRecentApplicationsAsync(int candidateId);
        Task<bool> UpdateResumeDetailsAsync(object id, string fileUrl, string v);
        Task GetProfileByUserIdAsync(string userId);
        Task<string?> GetCandidateIdByUserIdAsync(string userId);
    }

    public class RecentApplicationDto
    {
    }
}