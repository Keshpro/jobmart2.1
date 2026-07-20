using System.Threading.Tasks;

public interface ICandidateRepository
{
    Task<string> GetCandidateIdByUserIdAsync(string userId);
    Task<CandidateProfileDto> GetProfileByUserIdAsync(string userId);
    Task<bool> UpdateProfileAsync(string userId, UpdateCandidateDto updateDto);
    Task<CandidateKpiDto> GetKpisByCandidateIdAsync(string candidateId);
    Task<bool> SaveResumeRecordAsync(string candidateId, string fileUrl, string fileName);
}