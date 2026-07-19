namespace Backend.Models {
    public class Interview {
        public int InterviewId { get; set; }
        public int ApplicationId { get; set; }
        public DateTime InterviewDate { get; set; }
        public required Application Application { get; set; }
    }
}