namespace Backend.DTOs;
public class ApplicationDTO
{
    public int CandidateId { get; set; }
    public int JobId { get; set; }
    public string Status { get; set; } = "Pending";
}