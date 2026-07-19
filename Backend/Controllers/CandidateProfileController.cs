using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models; // ඔබගේ Models namespace එක මෙතනට දෙන්න
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidateProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/CandidateProfile
        [HttpPost]
        public async Task<ActionResult<Candidate>> CreateCandidate(Candidate candidate)
        {
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            return Ok(candidate);
        }

        // GET: api/CandidateProfile
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            return await _context.Candidates.ToListAsync();
        }
    }
}