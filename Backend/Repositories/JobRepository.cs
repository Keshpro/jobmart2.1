using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Dapper;

public class JobRepository : IJobRepository
{
    private readonly IDbConnection _dbConnection;

    public JobRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<IEnumerable<JobResponseDto>> GetFilteredJobsAsync(JobFilterDto filterDto)
    {
        var query = @"SELECT j.Id, j.Title, c.CompanyName, j.Location, j.JobType, j.Salary, j.Description, j.Requirements, j.PostedAt 
                      FROM Jobs j 
                      INNER JOIN Companies c ON j.CompanyId = c.Id 
                      WHERE (@SearchTerm IS NULL OR j.Title LIKE '%' + @SearchTerm + '%' OR j.Description LIKE '%' + @SearchTerm + '%')
                        AND (@Location IS NULL OR j.Location LIKE '%' + @Location + '%')
                        AND (@JobType IS NULL OR j.JobType = @JobType)
                        AND (@MinSalary IS NULL OR j.Salary >= @MinSalary)";

        return await _dbConnection.QueryAsync<JobResponseDto>(query, new
        {
            filterDto.SearchTerm,
            filterDto.Location,
            filterDto.JobType,
            filterDto.MinSalary
        });
    }

    public async Task<JobResponseDto> GetJobByIdAsync(string jobId)
    {
        var query = @"SELECT j.Id, j.Title, c.CompanyName, j.Location, j.JobType, j.Salary, j.Description, j.Requirements, j.PostedAt 
                      FROM Jobs j 
                      INNER JOIN Companies c ON j.CompanyId = c.Id 
                      WHERE j.Id = @JobId";

        return await _dbConnection.QueryFirstOrDefaultAsync<JobResponseDto>(query, new { JobId = jobId });
    }

    public async Task<bool> CreateApplicationAsync(string candidateId, JobApplicationDto applicationDto)
    {
        var query = @"INSERT INTO Applications (Id, JobId, CandidateId, ResumeId, CoverNote, Status, AppliedAt) 
                      VALUES (NEWID(), @JobId, @CandidateId, @ResumeId, @CoverNote, 'Applied', GETUTCDATE())";

        var rowsAffected = await _dbConnection.ExecuteAsync(query, new
        {
            applicationDto.JobId,
            CandidateId = candidateId,
            applicationDto.ResumeId,
            applicationDto.CoverNote
        });

        return rowsAffected > 0;
    }
}