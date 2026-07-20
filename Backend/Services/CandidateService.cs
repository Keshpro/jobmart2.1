using Backend.Repositories;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Backend.Models; // Oya DTOs saha Models thiyena namespace eka add karanna

namespace Backend.Services // Oyage namespace eka danna
{
    public class CandidateService : ICandidateService
    {
        private readonly ICandidateRepository _candidateRepository;
        private readonly ISupabaseStorageService _supabaseStorageService;

        public CandidateService(ICandidateRepository candidateRepository, ISupabaseStorageService supabaseStorageService)
        {
            _candidateRepository = candidateRepository;
            _supabaseStorageService = supabaseStorageService;
        }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        public async Task<CandidateProfileDto?> GetCandidateProfileAsync(string userId)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        {
            // 1. Repository eken Candidate entity eka gannawa
            var candidate = await _candidateRepository.GetCandidateByUserIdAsync(userId);
            if (candidate == null) return null;

            // 2. Candidate entity eka CandidateProfileDto ekata map karanawa
#pragma warning disable CS8601 // Possible null reference assignment.
            return new CandidateProfileDto
            {
                FullName = candidate.FullName,
                Phone = candidate.PhoneNumber,
                Bio = candidate.Bio,
                ResumeUrl = candidate.ResumeUrl,
                Skills = candidate.Skills
                // Oya DTO eke thiyena anith properties mekata add karanna
            };
#pragma warning restore CS8601 // Possible null reference assignment.
        }

        public async Task<bool> UpdateCandidateProfileAsync(string userId, UpdateCandidateDto updateDto)
        {
            // 1. Database eken update karanna one candidate wa gannawa
            var candidate = await _candidateRepository.GetCandidateByUserIdAsync(userId);
            if (candidate == null) return false;

            // 2. DTO eken ena aluth data tika entity ekata set karanawa
            if (!string.IsNullOrEmpty((string?)updateDto.Phone)) candidate.PhoneNumber = (string?)updateDto.Phone;
            if (!string.IsNullOrEmpty((string?)updateDto.Bio)) candidate.Bio = updateDto.Bio;

            // 3. Update karana eka repository eken call karanawa
            return await _candidateRepository.UpdateCandidateProfileAsync(candidate);
        }

        public async Task<CandidateKpiDto> GetDashboardKpisAsync(string userId)
        {
            // 1. User ID eken Candidate ge database ID (int) eka gannawa
            var candidate = await _candidateRepository.GetCandidateByUserIdAsync(userId);
            if (candidate == null) return new CandidateKpiDto(); // Empty object ekak return karanawa error nowenna

            // 2. E ID eken KPIs fetch karanawa
            return await _candidateRepository.GetDashboardKpisAsync(candidate.Id);
        }

#pragma warning disable CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        public async Task<string?> UploadAndSaveResumeAsync(string userId, IFormFile file)
#pragma warning restore CS8613 // Nullability of reference types in return type doesn't match implicitly implemented member.
        {
            // 1. Database eken Candidate ID (int) eka gannawa
            var candidate = await _candidateRepository.GetCandidateByUserIdAsync(userId);
            if (candidate == null) return null;

            // 2. Supabase ekata file eka upload karanawa
            var fileUrl = await _supabaseStorageService.UploadFileAsync(file, "resumes");
            if (string.IsNullOrEmpty(fileUrl)) return null;

            // 3. AI skills extract karana eka thama nathi nisa, danata skills walata "" (empty string) yawala URL eka save karanawa
            var saved = await _candidateRepository.UpdateResumeDetailsAsync(candidate.Id, fileUrl, "");

            return saved ? fileUrl : null;
        }
    }
}