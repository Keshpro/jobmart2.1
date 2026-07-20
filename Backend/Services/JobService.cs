using System.Collections.Generic;
using System.Threading.Tasks;

public interface IJobService
{
    Task<IEnumerable<JobResponseDto>> GetFilteredJobsAsync(JobFilterDto filterDto);
    Task<JobResponseDto> GetJobByIdAsync(string jobId);
    Task<bool> ApplyForJobAsync(string userId, JobApplicationDto applicationDto);
}

public class JobService : IJobService
{
    private readonly IJobRepository _jobRepository;
    private readonly ICandidateRepository _candidateRepository;

    public JobService(IJobRepository jobRepository, ICandidateRepository candidateRepository)
    {
        _jobRepository = jobRepository;
        _candidateRepository = candidateRepository;
    }

    public async Task<IEnumerable<JobResponseDto>> GetFilteredJobsAsync(JobFilterDto filterDto)
    {
        return await _jobRepository.GetFilteredJobsAsync(filterDto);
    }

    public async Task<JobResponseDto> GetJobByIdAsync(string jobId)
    {
        return await _jobRepository.GetJobByIdAsync(jobId);
    }

    public async Task<bool> ApplyForJobAsync(string userId, JobApplicationDto applicationDto)
    {
        var candidateId = await _candidateRepository.GetCandidateIdByUserIdAsync(userId);
        if (string.IsNullOrEmpty(candidateId)) return false;

        return await _jobRepository.CreateApplicationAsync(candidateId, applicationDto);
    }
}