using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByEmailAsync(string email);
    }
}