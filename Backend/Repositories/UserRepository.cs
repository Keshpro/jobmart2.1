using Backend.Data;
using Backend.Models;
using Dapper;
using System.Threading.Tasks;
// Oyage anik repositories wala use karana database namespace eka methanata danna

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context; // Oyage project eke Dapper connection eka handle karana class name eka (Eg: AppDbContext, DatabaseContext wage)

        // Methana generic 'DbContext' (EF Core) wenuwata oyage custom context eka danna
        public UserRepository(ApplicationDbContext context) // <-- Note: context variable type eka oyage project ekata match wenna one
        {
            _context = context;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var connection = (System.Data.IDbConnection)_context.CreateConnection();
            try
            {
                var query = "SELECT UserId, Username, Email, PasswordHash, RoleId FROM Users WHERE Email = @Email OR Username = @Username";
#pragma warning disable CS8603 // Possible null reference return.
                return await connection.QueryFirstOrDefaultAsync<User>(query, new { Email = email, Username = email });
#pragma warning restore CS8603 // Possible null reference return.
            }
            finally
            {
                connection?.Dispose();
            }
        }
    }
}