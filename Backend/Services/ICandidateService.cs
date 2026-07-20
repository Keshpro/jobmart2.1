using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public interface ICandidateService
{
    Task<CandidateProfileDto> GetCandidateProfileAsync(string userId);
    Task<bool> UpdateCandidateProfileAsync(string userId, UpdateCandidateDto updateDto);
    Task<CandidateKpiDto> GetDashboardKpisAsync(string userId);
    Task<string> UploadAndSaveResumeAsync(string userId, IFormFile file);
}

public class UpdateCandidateDto
{
}

public class CandidateKpiDto
{
}

public class CandidateProfileDto
{
}