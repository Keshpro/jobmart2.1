namespace Backend.Models {
    public class CandidateProfile {
        public int CandidateId { get; set; }
        public int UserId { get; set; }
        public required string FullName { get; set; }
        public required string PhoneNumber { get; set; }
        public required User User { get; set; }
    }
}