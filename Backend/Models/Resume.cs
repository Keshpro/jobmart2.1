namespace Backend.Models {
    public class Resume {
        public int ResumeId { get; set; }
        public int CandidateId { get; set; }
        public required string FilePath { get; set; }
        public DateTime UploadedAt { get; set; }

    }
}