using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CandidatesController : ControllerBase
{
    private readonly string _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

    public CandidatesController()
    {
        if (!Directory.Exists(_uploadPath)) Directory.CreateDirectory(_uploadPath);
    }

    [HttpPost("upload-resume")]
    public async Task<IActionResult> UploadResume(IFormFile resume)
    {
        if (resume == null || resume.Length == 0) return BadRequest("File is empty.");

        // 1. Generate unique file name
        string fileName = $"{Guid.NewGuid()}_{resume.FileName}";
        string filePath = Path.Combine(_uploadPath, fileName);

        // 2. Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await resume.CopyToAsync(stream);
        }

        // 3. Database logic here (Update Candidate table with filePath)
        // e.g., _context.Candidates.Update(new { ... });
        
        return Ok(new { message = "Upload successful", fileName = fileName });
    }
}