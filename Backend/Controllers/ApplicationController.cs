using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ApplicationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public ApplicationController(ApplicationDbContext context) => _context = context;

    [HttpGet] public async Task<ActionResult<IEnumerable<Application>>> Get() => await _context.Applications.ToListAsync();
    [HttpPost] public async Task<ActionResult<Application>> Post(Application app) { _context.Applications.Add(app); await _context.SaveChangesAsync(); return Ok(app); }
}