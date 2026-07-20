using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Supabase;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public CandidateController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);

            if (candidate == null)
            {
                return Ok(new
                {
                    fullName = username,
                    email = email,
                    phone = "Not Provided",
                    resume = (string?)null
                });
            }

            return Ok(new
            {
                fullName = candidate.FullName,
                email = candidate.Email,
                phone = candidate.PhoneNumber,
                resume = candidate.ResumePath
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCandidateProfile(CandidateDTO dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null) return Unauthorized();

            // UserId එක අනිවාර්යයෙන් ලබා දිය යුතුයි (Foreign Key Error එක මඟහරවා ගැනීමට)
            var userAccount = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (userAccount == null) return BadRequest(new { message = "User not found." });

            var candidate = new Candidate
            {
                UserId = userAccount.UserId, // නිවැරදි කළ ස්ථානය
                FullName = dto.FullName,
                Email = email,
                PhoneNumber = dto.PhoneNumber,
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCandidateProfile), new { id = candidate.CandidateId }, dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCandidateProfile(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null) return NotFound();
            return Ok(candidate);
        }

        // --- Supabase Upload Method ---
        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume([FromForm] IFormFile file) // [FromForm] අනිවාර්යයි
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Please select a file." });

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            string shareableUrl = string.Empty;

            try
            {
                // 1. appsettings.json එකෙන් සැබෑ Supabase දත්ත ලබා ගැනීම 
                var supabaseUrl = _configuration["Supabase:Url"]; 
                var supabaseKey = _configuration["Supabase:Key"];

                if (string.IsNullOrEmpty(supabaseUrl) || string.IsNullOrEmpty(supabaseKey))
                {
                    return StatusCode(500, new { message = "Supabase configuration is missing in appsettings.json." });
                }

                // 2. Supabase Client එක Initialize කිරීම
                var options = new SupabaseOptions { AutoConnectRealtime = false };
                var supabase = new Supabase.Client(supabaseUrl, supabaseKey, options);
                await supabase.InitializeAsync();

                // 3. File එක byte array එකක් බවට පත් කිරීම
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();

                    // 4. Supabase Storage හි "resumes" Bucket එකට Upload කිරීම
                    await supabase.Storage
                        .From("resumes")
                        .Upload(fileBytes, fileName, new Supabase.Storage.FileOptions { CacheControl = "3600", Upsert = true });
                }

                // 5. Upload වූ File එකෙහි Public URL එක ලබා ගැනීම
                shareableUrl = supabase.Storage.From("resumes").GetPublicUrl(fileName);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Supabase Error: " + ex.Message); 
                return StatusCode(500, new { message = "Supabase Upload Failed", error = ex.Message });
            }

            try 
            {
                // 6. Database එකේ URL එක Update කිරීම (UserId ගැටලුව නිවැරදි කර ඇත)
                var userAccount = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

                if (userAccount == null)
                {
                    return BadRequest(new { message = "User account not found." });
                }

                var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);

                if (candidate == null)
                {
                    candidate = new Candidate
                    {
                        UserId = userAccount.UserId, // නිවැරදි කළ ස්ථානය
                        FullName = username ?? "Unknown",
                        Email = email,
                        PhoneNumber = "Not Provided",
                        ResumePath = shareableUrl
                    };
                    _context.Candidates.Add(candidate);
                }
                else
                {
                    candidate.ResumePath = shareableUrl;
                }

                await _context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine("Database Save Error: " + (ex.InnerException?.Message ?? ex.Message));
                return StatusCode(500, new { message = "Database Update Failed", error = ex.InnerException?.Message ?? ex.Message });
            }

            return Ok(new { message = "Resume uploaded to Supabase successfully!", path = shareableUrl });
        }
    }
}