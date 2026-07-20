using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("parse-resume")]
    public async Task<IActionResult> ParseResume([FromBody] ResumeParseRequestDto requestDto)
    {
        var result = await _aiService.ParseResumeAsync(requestDto.ResumeUrl);
        if (result == null) return BadRequest(new { message = "Failed to parse resume." });

        return Ok(result);
    }

    [HttpPost("extract-skills")]
    public async Task<IActionResult> ExtractSkills([FromBody] SkillExtractionRequestDto requestDto)
    {
        var skills = await _aiService.ExtractSkillsAsync(requestDto.TextContent);
        return Ok(new { skills });
    }

    [HttpGet("match-score/{jobId}")]
    public async Task<IActionResult> GetMatchScore(string jobId)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var scoreResult = await _aiService.CalculateMatchScoreAsync(userId, jobId);
        return Ok(scoreResult);
    }

    [HttpGet("recommended-jobs")]
    public async Task<IActionResult> GetRecommendedJobs()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var recommendations = await _aiService.GetRecommendedJobsAsync(userId);
        return Ok(recommendations);
    }
}