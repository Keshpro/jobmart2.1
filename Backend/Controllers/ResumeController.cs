using Backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumeController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context; // DB context

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            // 1. Save File to local folder (Enterprise: use Cloud S3)
            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var path = Path.Combine("Uploads", fileName);
            using (var stream = new FileStream(path, FileMode.Create)) await file.CopyToAsync(stream);

            // 2. Simulate AI Analysis (Meka passe real AI API ekakin replace karanna)
            int aiScore = new Random().Next(70, 100); 

            // 3. Save to Database
            var record = new CandidateResume { 
                FileName = fileName, 
                FilePath = path, 
                AiScore = aiScore 
            };
            _context.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new { score = aiScore, message = "Analysis Complete" });
        }
    }
}