using System.Collections.Generic;
using System.Threading.Tasks;

public class JobFilterDto
{
    public string SearchTerm { get; set; }
    public string Location { get; set; }
    public string JobType { get; set; } // Full-time, Part-time, Remote, etc.
    public decimal? MinSalary { get; set; }
}

public class JobResponseDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string CompanyName { get; set; }
    public string Location { get; set; }
    public string JobType { get; set; }
    public decimal Salary { get; set; }
    public string Description { get; set; }
    public string Requirements { get; set; }
    public string PostedAt { get; set; }
}

public class JobApplicationDto
{
    public string JobId { get; set; }
    public string ResumeId { get; set; }
    public string CoverNote { get; set; }
}

public interface IJobRepository
{
    Task<IEnumerable<JobResponseDto>> GetFilteredJobsAsync(JobFilterDto filterDto);
    Task<JobResponseDto> GetJobByIdAsync(string jobId);
    Task<bool> CreateApplicationAsync(string candidateId, JobApplicationDto applicationDto);
}