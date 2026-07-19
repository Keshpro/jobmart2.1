using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkillController(ApplicationDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Skill>>> Get() => await _context.Skills.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<Skill>> Post(Skill skill)
        {
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();
            return Ok(skill);
        }
    }
}
