using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CandidateController : ControllerBase
{
    private readonly ICandidateService _candidateService;

    public CandidateController(ICandidateService candidateService)
    {
        _candidateService = candidateService;
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var profile = await _candidateService.GetCandidateProfileAsync(userId);
        if (profile == null) return NotFound(new { message = "Candidate profile not found." });

        return Ok(profile);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateCandidateDto updateDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var success = await _candidateService.UpdateCandidateProfileAsync(userId, updateDto);
        if (!success) return BadRequest(new { message = "Failed to update profile." });

        return Ok(new { message = "Profile updated successfully." });
    }

    [HttpGet("dashboard/kpis")]
    public async Task<IActionResult> GetDashboardKpis()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var kpis = await _candidateService.GetDashboardKpisAsync(userId);
        return Ok(kpis);
    }

    [HttpPost("resume")]
    public async Task<IActionResult> UploadResume(IFormFile file)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        var resumeUrl = await _candidateService.UploadAndSaveResumeAsync(userId, file);
        if (string.IsNullOrEmpty(resumeUrl))
            return StatusCode(500, new { message = "Failed to upload resume to storage." });

        return Ok(new { message = "Resume uploaded successfully.", url = resumeUrl });
    }
}