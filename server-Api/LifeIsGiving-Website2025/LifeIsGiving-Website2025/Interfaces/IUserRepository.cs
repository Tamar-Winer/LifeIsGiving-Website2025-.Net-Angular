using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IUserRepository
    {
        Task AddUser(User user);
        Task<List<User>> GetUsers();

        Task<User?> GetUserById(int Id);
        Task<List<User>> GetUsersByRole(UserRole role);
        Task<bool> UpdateUser(User user);
        Task<bool> DeleteUser(int id);
        Task<List<User>> GetBySort(string? name = null, string? email = null, string? prizeName = null);
        Task<User?> GetUserByUserName(string userName);
        Task<List<User>> GetBuyers();
        Task<List<User>> GetDonors();
        Task<User?> GetBuyerById(int id);
        Task<User?> GetDonorById(int id);

    }
}
