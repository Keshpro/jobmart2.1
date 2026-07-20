using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class JobController : ControllerBase
{
    private readonly IJobService _jobService;

    public JobController(IJobService jobService)
    {
        _jobService = jobService;
    }

    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] JobFilterDto filterDto)
    {
        var jobs = await _jobService.GetFilteredJobsAsync(filterDto);
        return Ok(jobs);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobById(string id)
    {
        var job = await _jobService.GetJobByIdAsync(id);
        if (job == null) return NotFound(new { message = "Job not found." });

        return Ok(job);
    }

    [HttpPost("apply")]
    [Authorize]
    public async Task<IActionResult> ApplyForJob([FromBody] JobApplicationDto applicationDto)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var success = await _jobService.ApplyForJobAsync(userId, applicationDto);
        if (!success) return BadRequest(new { message = "Failed to submit job application." });

        return Ok(new { message = "Job application submitted successfully." });
    }
}