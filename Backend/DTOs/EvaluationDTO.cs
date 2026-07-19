namespace Backend.DTOs;
public class EvaluationDTO
{
    public int InterviewId { get; set; }
    public int Score { get; set; }
    public string Comments { get; set; } = string.Empty;
}