using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Backend.DTOs; // DTO එක ඇති namespace එක
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobPostingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/JobPosting
        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobPosting>>> GetJobPostings()
        {
            return await _context.JobPostings.ToListAsync();
        }

        // GET: api/JobPosting/5
        [HttpGet("{id}")]
        public async Task<ActionResult<JobPosting>> GetJobPosting(int id)
        {
            var job = await _context.JobPostings.FindAsync(id);
            if (job == null) return NotFound();
            return job;
        }

        // POST: api/JobPosting
        [HttpPost]
        public async Task<ActionResult<JobPosting>> PostJob(JobPostingDTO jobDto)
        {
            // DTO එකෙන් Entity එකට දත්ත මාරු කිරීම (Mapping)
            var job = new JobPosting
            {
                Title = jobDto.Title,
                Description = jobDto.Description,
                Requirements = jobDto.Requirements,
                SalaryRange = jobDto.SalaryRange
            };

            _context.JobPostings.Add(job);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetJobPosting), new { id = job.JobId }, job);
        }

        // DELETE: api/JobPosting/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.JobPostings.FindAsync(id);
            if (job == null) return NotFound();

            _context.JobPostings.Remove(job);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}