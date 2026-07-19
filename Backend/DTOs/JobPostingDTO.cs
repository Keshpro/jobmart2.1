namespace Backend.DTOs
{
    public class JobPostingDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public decimal SalaryRange { get; set; }
    }
}