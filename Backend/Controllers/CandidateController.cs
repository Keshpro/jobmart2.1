using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Microsoft.Graph;
using Azure.Identity;

namespace Backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CandidateController(ApplicationDbContext context)
        {
            _context = context;
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

            var candidate = new Candidate
            {
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

        // --- OneDrive Upload Method එක ---
        [HttpPost("upload")]
        public async Task<IActionResult> UploadResume(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "Please select a file." });

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            string shareableUrl = string.Empty;

            try
            {
                // 1. OneDrive (Microsoft Graph API) වෙත සම්බන්ධ වීම
                var tenantId = "YOUR_AZURE_TENANT_ID";
                var clientId = "YOUR_AZURE_CLIENT_ID";
                var clientSecret = "YOUR_AZURE_CLIENT_SECRET";
                var adminUserId = "YOUR_ONEDRIVE_ACCOUNT_OBJECT_ID";

                var credentials = new ClientSecretCredential(tenantId, clientId, clientSecret);
                var graphClient = new GraphServiceClient(credentials);

                // 2. File එක Memory එකට අරගෙන OneDrive එකට Upload කිරීම
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    stream.Position = 0;

                    var uploadPath = $"Resumes/{fileName}";

                    // --- දෝෂය නිවැරදි කළ ස්ථානය මෙතැන් සිට ---

                    // පියවර 2.1: අදාළ User ගේ Drive එක ලබාගැනීම
                    var drive = await graphClient.Users[adminUserId].Drive.GetAsync();
                    var driveId = drive?.Id;

                    // පියවර 2.2: v5 Indexer ක්‍රමය භාවිතා කර File එක Upload කිරීම
                    var uploadedItem = await graphClient.Drives[driveId].Items[$"root:/{uploadPath}:"]
                        .Content.PutAsync(stream);

                    // 3. Upload වුණු File එකට Shareable Link එකක් සෑදීම
                    // v5 හි නිවැරදි Namespace එක යොදා ඇත
                    var requestBody = new Microsoft.Graph.Drives.Item.Items.Item.CreateLink.CreateLinkPostRequestBody
                    {
                        Type = "view",
                        Scope = "anonymous"
                    };

                    var linkResult = await graphClient.Drives[driveId].Items[uploadedItem?.Id]
                        .CreateLink.PostAsync(requestBody);

                    shareableUrl = linkResult?.Link?.WebUrl ?? string.Empty;

                    // --- වෙනස් කළ කොටස අවසන් ---
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "OneDrive Upload Failed", error = ex.Message });
            }

            // 4. Database එකේ URL එක Update කිරීම
            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == email);

            if (candidate == null)
            {
                candidate = new Candidate
                {
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

            return Ok(new { message = "Resume uploaded to OneDrive successfully!", path = shareableUrl });
        }
    }
}