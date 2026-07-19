namespace Backend.DTOs;
public class InterviewDTO
{
    public int ApplicationId { get; set; }
    public DateTime InterviewDate { get; set; }
    public string Location { get; set; } = string.Empty;
}