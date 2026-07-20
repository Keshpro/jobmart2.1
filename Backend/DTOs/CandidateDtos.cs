namespace Backend.DTOs;
public class CandidateProfileDto
{
    public string Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Bio { get; set; }
    public string Skills { get; set; }
}

public class UpdateCandidateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Phone { get; set; }
    public string Bio { get; set; }
    public string Skills { get; set; }
}

public class CandidateKpiDto
{
    public int AppliedCount { get; set; }
    public int RejectedCount { get; set; }
    public int PendingCount { get; set; }
    public int CompletedCount { get; set; }
}