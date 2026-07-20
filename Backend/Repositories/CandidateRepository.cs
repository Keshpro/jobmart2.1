using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Backend.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class CandidateRepository : ICandidateRepository
    {
        private readonly string _connectionString;

        // Constructor eken appsettings.json wala thiyena Connection String eka gannawa
        public CandidateRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                                ?? throw new System.ArgumentNullException("DefaultConnection is missing!");
        }

        // Database connection eka create karana method eka
        private IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        // 1. UserID eken Candidate Profile eka ganna
        public async Task<Candidate> GetCandidateByUserIdAsync(string userId)
        {
            var query = "SELECT * FROM Candidates WHERE UserId = @UserId";

            using var connection = CreateConnection();
#pragma warning disable CS8603 // Possible null reference return.
            return await connection.QuerySingleOrDefaultAsync<Candidate>(query, new { UserId = userId });
#pragma warning restore CS8603 // Possible null reference return.
        }

        // 2. Candidate Profile eka update karanna
        public async Task<bool> UpdateCandidateProfileAsync(Candidate candidate)
        {
            var query = @"
                UPDATE Candidates 
                SET FullName = @FullName, 
                    Phone = @Phone, 
                    Bio = @Bio, 
                    UpdatedAt = GETDATE()
                WHERE Id = @Id";

            using var connection = CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, candidate);
            return rowsAffected > 0;
        }

        // 3. Supabase eken ena CV URL eka saha AI extract karana skills save karanna
        public async Task<bool> UpdateResumeDetailsAsync(int candidateId, string resumeUrl, string extractedSkills)
        {
            var query = @"
                UPDATE Candidates 
                SET ResumeUrl = @ResumeUrl, 
                    Skills = @Skills,
                    UpdatedAt = GETDATE()
                WHERE Id = @Id";

            using var connection = CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(query, new { Id = candidateId, ResumeUrl = resumeUrl, Skills = extractedSkills });
            return rowsAffected > 0;
        }

        // 4. Dashboard KPIs (Applied, Pending, Interviews, Rejections) count eka ganna
        public async Task<CandidateKpiDto> GetDashboardKpisAsync(int candidateId)
        {
            // Application table eken status eka anuwa group karala counts gannawa
            var query = @"
                SELECT 
                    COUNT(Id) AS Applied,
                    SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS Pending,
                    SUM(CASE WHEN Status = 'Interview' THEN 1 ELSE 0 END) AS Interviews,
                    SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS Rejections
                FROM JobApplications
                WHERE CandidateId = @CandidateId";

            using var connection = CreateConnection();
            return await connection.QuerySingleOrDefaultAsync<CandidateKpiDto>(query, new { CandidateId = candidateId })
                   ?? new CandidateKpiDto(); // Null nam empty object ekak return karanawa
        }

        // 5. Dashboard ekata Recent Applications tika ganna
        public async Task<IEnumerable<RecentApplicationDto>> GetRecentApplicationsAsync(int candidateId)
        {
            var query = @"
                SELECT TOP 5 
                    a.Id, 
                    j.Title AS JobTitle, 
                    c.Name AS CompanyName, 
                    a.AppliedDate, 
                    a.Status
                FROM JobApplications a
                INNER JOIN Jobs j ON a.JobId = j.Id
                INNER JOIN Companies c ON j.CompanyId = c.Id
                WHERE a.CandidateId = @CandidateId
                ORDER BY a.AppliedDate DESC";

            using var connection = CreateConnection();
            return await connection.QueryAsync<RecentApplicationDto>(query, new { CandidateId = candidateId });
        }

        public Task<bool> UpdateResumeDetailsAsync(object id, string fileUrl, string v)
        {
            throw new NotImplementedException();
        }

        public Task GetProfileByUserIdAsync(string userId)
        {
            throw new NotImplementedException();
        }

        public Task<string?> GetCandidateIdByUserIdAsync(string userId)
        {
            throw new NotImplementedException();
        }
    }
}