using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IUserService
    {
        Task AddUser(UserCreateDto userDto);
        Task<List<UserDto>> GetUsers();

        Task<UserDto?> GetUserById(int Id);
        Task<List<User>> GetUsersByRole(UserRole role);
        Task<bool> UpdateUser(int id, UserUpdateDto dto);
        Task<bool> DeleteUser(int id);
        Task<List<UserDto>> GetBySort(string? name = null, string? email = null, string? prizeName = null);
        Task<User?> GetUserByUserName(string userName);

        Task<UserDto?> GetBuyerById(int id);
        Task<UserDonorDto?> GetDonorById(int id);
       Task<List<UserDto>> GetBuyers();

        Task<List<UserDonorDto>> GetDonors();


    }
}
