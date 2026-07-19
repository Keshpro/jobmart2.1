namespace Backend.Models
{
    public class Resume
    {
        public int Id { get; set; }
        public string FilePath { get; set; }
        public int CandidateId { get; set; } // Foreign Key
        public Candidate Candidate { get; set; }
    }
}