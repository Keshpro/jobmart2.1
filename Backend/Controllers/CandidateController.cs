using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore; // Async/Await Database calls සඳහා
using Backend.Data;
using Backend.Models;
using Backend.DTOs;

namespace Backend.Controllers // ඔබේ namespace එකට ගැලපෙන සේ වෙනස් කරගන්න
{
    [Authorize] // Login වුන අයට විතරයි ඇතුළු වෙන්න පුළුවන්
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidateController(ApplicationDbContext context)
        {
            _context = context;
        }

        // --- 1. Dashboard එකට දත්ත යවන Profile Endpoint එක (අලුතින් එක් කළා) ---
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Token එකෙන් Email එක සහ Username එක ලබාගැනීම
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email)) return Unauthorized();

            // Database එකෙන් Candidate කෙනෙක් ඉන්නවාදැයි බැලීම
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);

            if (candidate == null)
            {
                // තවමත් Database එකේ profile එකක් නැත්නම්, Token එකේ තියෙන දත්ත යවනවා (Dashboard එක වැඩ කරන්න)
                return Ok(new { 
                    fullName = username, 
                    email = email, 
                    phone = "Not Provided" 
                });
            }

            // Database එකේ profile එකක් තියෙනවා නම් ඒක යවනවා
            return Ok(new {
                fullName = candidate.FullName,
                email = candidate.Email,
                phone = candidate.PhoneNumber
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCandidateProfile(CandidateDTO dto)
        {
            // අපි NameIdentifier වෙනුවට Email එක පාවිච්චි කරනවා (Token එකේ තියෙන්නේ ඒක නිසා)
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null) return Unauthorized();

            var candidate = new Candidate
            {
                FullName = dto.FullName,
                Email = email, // DTO එකෙන් නෙවෙයි, Token එකෙන්ම ගන්න එක ආරක්ෂිතයි
                PhoneNumber = dto.PhoneNumber,
                // UserId = ... // ඔබට වෙනම Users table එකක් තියෙනවා නම් පමණක් මෙතන සෙට් කරන්න
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

        // --- 2. React එකට ගැලපෙන ලෙස "upload" ලෙස වෙනස් කළා ---
        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("File එකක් තෝරන්න.");

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // NameIdentifier වෙනුවට Email එකෙන් Candidate ව හොයාගන්නවා
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);

            // Candidate කෙනෙක් Database එකේ හදලා තියෙනවා නම් විතරක් Path එක Update කරනවා
            if (candidate != null)
            {
                candidate.ResumePath = fileName;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "CV එක සාර්ථකව upload විය!", path = fileName });
        }
    }
}