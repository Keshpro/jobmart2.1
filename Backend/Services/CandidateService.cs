using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

public class CandidateService : ICandidateService
{
    private readonly ICandidateRepository _candidateRepository;
    private readonly ISupabaseStorageService _supabaseStorageService;

    public CandidateService(ICandidateRepository candidateRepository, ISupabaseStorageService supabaseStorageService)
    {
        _candidateRepository = candidateRepository;
        _supabaseStorageService = supabaseStorageService;
    }

    public async Task<CandidateProfileDto> GetCandidateProfileAsync(string userId)
    {
        return await _candidateRepository.GetProfileByUserIdAsync(userId);
    }

    public async Task<bool> UpdateCandidateProfileAsync(string userId, UpdateCandidateDto updateDto)
    {
        return await _candidateRepository.UpdateProfileAsync(userId, updateDto);
    }

    public async Task<CandidateKpiDto> GetDashboardKpisAsync(string userId)
    {
        var candidateId = await _candidateRepository.GetCandidateIdByUserIdAsync(userId);
        return await _candidateRepository.GetKpisByCandidateIdAsync(candidateId);
    }

    public async Task<string> UploadAndSaveResumeAsync(string userId, IFormFile file)
    {
        var candidateId = await _candidateRepository.GetCandidateIdByUserIdAsync(userId);
        if (string.IsNullOrEmpty(candidateId)) return null;

        var fileUrl = await _supabaseStorageService.UploadFileAsync(file, "resumes");
        if (string.IsNullOrEmpty(fileUrl)) return null;

        var saved = await _candidateRepository.SaveResumeRecordAsync(candidateId, fileUrl, file.FileName);
        return saved ? fileUrl : null;
    }
}