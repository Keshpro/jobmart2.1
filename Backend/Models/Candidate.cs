namespace Backend.Models
{
    public class Candidate
    {
        public int CandidateId { get; set; }
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ResumePath { get; set; } // CV එක තියෙන තැන
        
        // User එකත් එක්ක සම්බන්ධ කරන්න (Foreign Key)
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}