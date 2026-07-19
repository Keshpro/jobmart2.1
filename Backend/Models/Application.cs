namespace Backend.Models {
    public class Application {
        public int ApplicationId { get; set; }
        public int CandidateId { get; set; }
        public int JobId { get; set; }
        public required string Status { get; set; }
        public DateTime AppliedDate { get; set; }
        public required CandidateProfile CandidateProfile { get; set; }
        public required JobPosting JobPosting { get; set; }
    }
}