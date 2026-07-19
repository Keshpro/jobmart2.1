using Microsoft.AspNetCore.Mvc;
using Backend.Data;    // ඔබේ ApplicationDbContext තිබෙන තැන
using Backend.Models;  // ඔබේ User model එක තිබෙන තැන
using Microsoft.EntityFrameworkCore;
[Route("api/[controller]")]
[ApiController]
public class EvaluationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public EvaluationController(ApplicationDbContext context) => _context = context;

    [HttpGet] public async Task<ActionResult<IEnumerable<Evaluation>>> Get() => await _context.Evaluations.ToListAsync();
    [HttpPost] public async Task<ActionResult<Evaluation>> Post(Evaluation eval) { _context.Evaluations.Add(eval); await _context.SaveChangesAsync(); return Ok(eval); }
}