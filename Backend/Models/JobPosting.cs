namespace Backend.Models {
    public class JobPosting {
        internal decimal SalaryRange;

        public int JobId { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime PostedDate { get; set; }
        public string Requirements { get; internal set; }
    }
}