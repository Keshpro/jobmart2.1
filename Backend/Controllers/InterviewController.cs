using Microsoft.AspNetCore.Mvc;
using Backend.Data;    // ඔබේ ApplicationDbContext තිබෙන තැන
using Backend.Models;  // ඔබේ User model එක තිබෙන තැන
using Microsoft.EntityFrameworkCore;
[Route("api/[controller]")]
[ApiController]
public class InterviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public InterviewController(ApplicationDbContext context) => _context = context;

    [HttpGet] public async Task<ActionResult<IEnumerable<Interview>>> Get() => await _context.Interviews.ToListAsync();
    [HttpPost] public async Task<ActionResult<Interview>> Post(Interview interview) { _context.Interviews.Add(interview); await _context.SaveChangesAsync(); return Ok(interview); }
}