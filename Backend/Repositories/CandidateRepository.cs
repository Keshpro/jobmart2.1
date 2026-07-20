using System.Threading.Tasks;
using System.Data;
using Dapper;

public class CandidateRepository : ICandidateRepository
{
    private readonly IDbConnection _dbConnection;

    public object Dapper { get; private set; }

    public CandidateRepository(IDbConnection dbConnection)
    {
        _dbConnection = dbConnection;
    }

    public async Task<string> GetCandidateIdByUserIdAsync(string userId)
    {
        var query = "SELECT Id FROM Candidates WHERE UserId = @UserId";
        return await _dbConnection.ExecuteScalarAsync<string>(query, new { UserId = userId });
    }

    public async Task<CandidateProfileDto> GetProfileByUserIdAsync(string userId)
    {
        var query = @"SELECT c.Id, c.FirstName, c.LastName, c.Phone, c.Bio, c.Skills, u.Email 
                      FROM Candidates c 
                      INNER JOIN Users u ON c.UserId = u.Id 
                      WHERE c.UserId = @UserId";
        return await _dbConnection.QueryFirstOrDefaultAsync<CandidateProfileDto>(query, new { UserId = userId });
    }

    public async Task<bool> UpdateProfileAsync(string userId, UpdateCandidateDto updateDto)
    {
        var query = @"UPDATE Candidates 
                      SET FirstName = @FirstName, LastName = @LastName, Phone = @Phone, Bio = @Bio, Skills = @Skills 
                      WHERE UserId = @UserId";
        var rowsAffected = await _dbConnection.ExecuteAsync(query, new {
            updateDto.FirstName,
            updateDto.LastName,
            updateDto.Phone,
            updateDto.Bio,
            updateDto.Skills,
            UserId = userId
        });
        return rowsAffected > 0;
    }

    public async Task<CandidateKpiDto> GetKpisByCandidateIdAsync(string candidateId)
    {
        var query = @"SELECT 
                        SUM(CASE WHEN Status = 'Applied' THEN 1 ELSE 0 END) AS AppliedCount,
                        SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS RejectedCount,
                        SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS PendingCount,
                        SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedCount
                      FROM Applications 
                      WHERE CandidateId = @CandidateId";
        
        var result = await Dapper.SqlMapper.QueryFirstOrDefaultAsync<CandidateKpiDto>(_dbConnection, query, new { CandidateId = candidateId });
        return result ?? new CandidateKpiDto();
    }

    public async Task<bool> SaveResumeRecordAsync(string candidateId, string fileUrl, string fileName)
    {
        var query = "INSERT INTO Resumes (Id, CandidateId, FileUrl, FileName, UploadedAt) VALUES (NEWID(), @CandidateId, @FileUrl, @FileName, GETUTCDATE())";
        var rowsAffected = await _dbConnection.ExecuteAsync(query, new { CandidateId = candidateId, FileUrl = fileUrl, FileName = fileName });
        return rowsAffected > 0;
    }
}