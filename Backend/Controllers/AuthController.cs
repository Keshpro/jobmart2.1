// Backend/Controllers/AuthController.cs
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace JOBMART2.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DbContext _context;

        public AuthController(DbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Candidate candidate)
        {
            // මෙතනදී password එක hash කරන්න (මතක තියාගන්න)
            _context.Set<Candidate>().Add(candidate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public IActionResult Login(string email, string password)
        {
            // මෙතනදී database එකෙන් email එක check කර password එක බලන්න
            return Ok(new { message = "Login successful!", token = "your-jwt-token" });
        }
    }
}