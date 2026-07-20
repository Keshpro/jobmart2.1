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
    public object FirstName { get; internal set; }
    public object LastName { get; internal set; }
    public object Phone { get; internal set; }
    public object Bio { get; internal set; }
    public string FullName { get; internal set; }
}

public class CandidateKpiDto
{
}

public class CandidateProfileDto
{
    public string FullName { get; internal set; }
    public object Phone { get; internal set; }
    public object ResumeUrl { get; internal set; }
    public object Skills { get; internal set; }
    public object Bio { get; internal set; }
}