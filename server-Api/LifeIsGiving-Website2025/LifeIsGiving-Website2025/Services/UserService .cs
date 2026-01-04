//using LifeIsGiving_Website2025.Dtos;
//using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
//using LifeIsGiving_Website2025.Interfaces;
//using LifeIsGiving_Website2025.Models;
//using LifeIsGiving_Website2025.Models.Enums;
//using Microsoft.AspNetCore.Identity;

//namespace LifeIsGiving_Website2025.Services
//{
//    public class UserService : IUserService
//    {
//        private readonly IUserRepository _userRepository;
//        private readonly PasswordHasher<User> _passwordHasher;

//        public UserService(IUserRepository userRepository)
//        {
//            _userRepository = userRepository;
//            _passwordHasher = new PasswordHasher<User>();
//        }

//        public async Task AddUser(UserCreateDto userDto)
//        {
//            var user = new User
//            {
//                UserName = userDto.UserName,
//                Name = userDto.Name,
//                Email = userDto.Email,
//                Phone = userDto.Phone,
//                Address = userDto.Address,
//                Role = userDto.Role
//            };

//            user.Password = _passwordHasher.HashPassword(user, userDto.Password);
//            await _userRepository.AddUser(user);
//        }

//        public async Task<List<UserDto>> GetUsers()
//        {
//            var users = await _userRepository.GetUsers();

//            return users.Select(u => new UserDto
//            {
//                UserName = u.UserName,
//                Name = u.Name,
//                Email = u.Email,
//                Phone = u.Phone,
//                Address = u.Address,
//                Role = u.Role,

//                Winnings = u.Winnings.Select(w => new WinningDto
//                {
//                    PrizeName = w.Prize.Name,
//                    WinnerName = w.WinnerUser != null ? w.WinnerUser.Name : null,
//                    LotteryDate = w.LotteryDate
//                }).ToList(),

//                Purchases = u.Purchases.Select(p => new PurchaseDto
//                {
//                    Id = p.Id,
//                    UserName = p.User.Name,
//                    PrizeName = p.Prize.Name,
//                    PriceAtPurchase = p.PriceAtPurchase,
//                    Quantity = p.Quantity,
//                    Status = p.Status.ToString(),
//                    CreatedAt = p.CreatedAt
//                }).ToList()
//            }).ToList();
//        }


//        public async Task<List<UserDto>> GetBuyers()
//        {
//            var buyers = await _userRepository.GetBuyers();

//            return buyers.Select(u => new UserDto
//            {
//                UserName = u.UserName,
//                Name = u.Name,
//                Email = u.Email,
//                Phone = u.Phone,
//                Address = u.Address,
//                Role = u.Role,

//                Winnings = u.Winnings.Select(w => new WinningDto
//                {
//                    PrizeName = w.Prize.Name,
//                    WinnerName = w.WinnerUser != null ? w.WinnerUser.Name : null,
//                    LotteryDate = w.LotteryDate
//                }).ToList(),

//                Purchases = u.Purchases.Select(p => new PurchaseDto
//                {
//                    Id = p.Id,
//                    UserName = p.User.Name,
//                    PrizeName = p.Prize.Name,
//                    PriceAtPurchase = p.PriceAtPurchase,
//                    Quantity = p.Quantity,
//                    Status = p.Status.ToString(),
//                    CreatedAt = p.CreatedAt
//                }).ToList()

//            }).ToList();
//        }
//        public async Task<List<UserDonorDto>> GetDonors()
//        {
//            var donors = await _userRepository.GetDonors();

//            return donors.Select(u => new UserDonorDto
//            {
//                UserName = u.UserName,
//                Name = u.Name,
//                Email = u.Email,
//                Phone = u.Phone,
//                Address = u.Address,
//                Role = u.Role,
//                PrizesDonated = u.PrizesDonated.Select(p => new PrizeDto
//                {
//                    Name = p.Name,
//                    Description = p.Description,
//                    Category = p.Category,
//                    Price = p.Price,
//                    ImageUrl = p.ImageUrl
//                }).ToList()
//            }).ToList();
//        }

//        public async Task<UserDto?> GetBuyerById(int id)
//        {
//            var user = await _userRepository.GetBuyerById(id);
//            if (user == null) return null;

//            return new UserDto
//            {
//                UserName = user.UserName,
//                Name = user.Name,
//                Email = user.Email,
//                Phone = user.Phone,
//                Address = user.Address,
//                Role = user.Role,

//                Winnings = user.Winnings.Select(w => new WinningDto
//                {
//                    PrizeName = w.Prize.Name,
//                    WinnerName = w.WinnerUser != null ? w.WinnerUser.Name : null,
//                    LotteryDate = w.LotteryDate
//                }).ToList(),

//                Purchases = user.Purchases.Select(p => new PurchaseDto
//                {
//                    Id = p.Id,
//                    UserName = p.User.Name,
//                    PrizeName = p.Prize.Name,
//                    PriceAtPurchase = p.PriceAtPurchase,
//                    Quantity = p.Quantity,
//                    Status = p.Status.ToString(),
//                    CreatedAt = p.CreatedAt
//                }).ToList()
//            };
//        }

//        public async Task<UserDonorDto?> GetDonorById(int id)
//        {
//            var user = await _userRepository.GetDonorById(id);
//            if (user == null) return null;

//            return new UserDonorDto
//            {
//                UserName = user.UserName,
//                Name = user.Name,
//                Email = user.Email,
//                Phone = user.Phone,
//                Address = user.Address,
//                Role = user.Role,

//                PrizesDonated = user.PrizesDonated.Select(p => new PrizeDto
//                {
//                    Name = p.Name,
//                    Description = p.Description,
//                    Category = p.Category,
//                    Price = p.Price,
//                    ImageUrl = p.ImageUrl
//                }).ToList()
//            };
//        }





//        public async Task<UserDto?> GetUserById(int id)
//        {
//            var user = await _userRepository.GetUserById(id);
//            if (user == null) return null;

//            return new UserDto
//            {
//                UserName = user.UserName,
//                Name = user.Name,
//                Email = user.Email,
//                Phone = user.Phone,
//                Address = user.Address,
//                Role = user.Role,
//            };
//        }

//        public async Task<List<User>> GetUsersByRole(UserRole role)
//        {
//            return await _userRepository.GetUsersByRole(role);
//        }

//        public async Task<bool> UpdateUser(int id, UserUpdateDto dto)
//        {
//            var user = await _userRepository.GetUserById(id);
//            if (user == null) return false;

//            user.UserName = dto.UserName ?? user.UserName;
//            user.Name = dto.Name ?? user.Name;
//            user.Email = dto.Email ?? user.Email;
//            user.Phone = dto.Phone ?? user.Phone;
//            user.Address = dto.Address ?? user.Address;
//            user.Role = dto.Role ?? user.Role;

//            return await _userRepository.UpdateUser(user);
//        }

//        public async Task<bool> DeleteUser(int id)
//        {
//            return await _userRepository.DeleteUser(id);
//        }

//        public async Task<List<UserDto>> GetBySort(string? name = null, string? email = null, string? prizeName = null)
//        {
//            var donors = await _userRepository.GetBySort(name, email, prizeName);
//            return donors.Select(u => new UserDto
//            {
//                UserName = u.UserName,
//                Name = u.Name,
//                Email = u.Email,
//                Phone = u.Phone,
//                Address = u.Address,
//                Role = u.Role,
//            }).ToList();
//        }

//        public async Task<User?> GetUserByUserName(string userName)
//        {
//            return await _userRepository.GetUserByUserName(userName);
//        }

//    }
//}

using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace LifeIsGiving_Website2025.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _passwordHasher = new PasswordHasher<User>();
            _logger = logger;
        }

        public async Task AddUser(UserCreateDto userDto)
        {
            _logger.LogInformation("AddUser started. UserName: {UserName}, Email: {Email}",
                userDto.UserName, userDto.Email);

            try
            {
                var user = new User
                {
                    UserName = userDto.UserName,
                    Name = userDto.Name,
                    Email = userDto.Email,
                    Phone = userDto.Phone,
                    Address = userDto.Address,
                    Role = userDto.Role
                };

                user.Password = _passwordHasher.HashPassword(user, userDto.Password);
                await _userRepository.AddUser(user);

                _logger.LogInformation("User added successfully. UserName: {UserName}", user.UserName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding user. UserName: {UserName}", userDto.UserName);
                throw;
            }
        }

        public async Task<List<UserDto>> GetUsers()
        {
            _logger.LogInformation("GetUsers started");

            try
            {
                var users = await _userRepository.GetUsers();

                _logger.LogInformation("Retrieved {Count} users", users.Count);
                return users.Select(u => new UserDto
                {
                    UserName = u.UserName,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Role = u.Role,

                    Winnings = u.Winnings.Select(w => new WinningDto
                    {
                        PrizeName = w.Prize.Name,
                        WinnerName = w.WinnerUser != null ? w.WinnerUser.Name : null,
                        LotteryDate = w.LotteryDate
                    }).ToList(),

                    Purchases = u.Purchases.Select(p => new PurchaseDto
                    {
                        Id = p.Id,
                        UserName = p.User.Name,
                        PrizeName = p.Prize.Name,
                        PriceAtPurchase = p.PriceAtPurchase,
                        Quantity = p.Quantity,
                        Status = p.Status.ToString(),
                        CreatedAt = p.CreatedAt
                    }).ToList()
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving users");
                throw;
            }
        }

        public async Task<List<UserDto>> GetBuyers()
        {
            _logger.LogInformation("GetBuyers started");

            try
            {
                var buyers = await _userRepository.GetBuyers();

                _logger.LogInformation("Retrieved {Count} buyers", buyers.Count);
                return buyers.Select(u => new UserDto
                {
                    UserName = u.UserName,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Role = u.Role,

                    Winnings = u.Winnings.Select(w => new WinningDto
                    {
                        PrizeName = w.Prize.Name,
                        WinnerName = w.WinnerUser != null ? w.WinnerUser.Name : null,
                        LotteryDate = w.LotteryDate
                    }).ToList(),

                    Purchases = u.Purchases.Select(p => new PurchaseDto
                    {
                        Id = p.Id,
                        UserName = p.User.Name,
                        PrizeName = p.Prize.Name,
                        PriceAtPurchase = p.PriceAtPurchase,
                        Quantity = p.Quantity,
                        Status = p.Status.ToString(),
                        CreatedAt = p.CreatedAt
                    }).ToList()
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving buyers");
                throw;
            }
        }

        public async Task<List<UserDonorDto>> GetDonors()
        {
            _logger.LogInformation("GetDonors started");

            try
            {
                var donors = await _userRepository.GetDonors();

                _logger.LogInformation("Retrieved {Count} donors", donors.Count);
                return donors.Select(u => new UserDonorDto
                {
                    UserName = u.UserName,
                    Name = u.Name,
                    Email = u.Email,
                    Phone = u.Phone,
                    Address = u.Address,
                    Role = u.Role,
                    PrizesDonated = u.PrizesDonated.Select(p => new PrizeDto
                    {
                        Name = p.Name,
                        Description = p.Description,
                        Category = p.Category,
                        Price = p.Price,
                        ImageUrl = p.ImageUrl
                    }).ToList()
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving donors");
                throw;
            }
        }

        public async Task<UserDto?> GetBuyerById(int id)
        {
            _logger.LogInformation("GetBuyerById started. UserId: {UserId}", id);

            var user = await _userRepository.GetBuyerById(id);
            if (user == null)
            {
                _logger.LogWarning("Buyer not found. UserId: {UserId}", id);
                return null;
            }

            _logger.LogInformation("Buyer retrieved successfully. UserId: {UserId}", id);

            return new UserDto
            {
                UserName = user.UserName,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
            };
        }

        public async Task<UserDonorDto?> GetDonorById(int id)
        {
            _logger.LogInformation("GetDonorById started. UserId: {UserId}", id);

            var user = await _userRepository.GetDonorById(id);
            if (user == null)
            {
                _logger.LogWarning("Donor not found. UserId: {UserId}", id);
                return null;
            }

            _logger.LogInformation("Donor retrieved successfully. UserId: {UserId}", id);

            return new UserDonorDto
            {
                UserName = user.UserName,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
            };
        }

        public async Task<UserDto?> GetUserById(int id)
        {
            _logger.LogInformation("GetUserById started. UserId: {UserId}", id);

            var user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                _logger.LogWarning("User not found. UserId: {UserId}", id);
                return null;
            }

            _logger.LogInformation("User retrieved successfully. UserId: {UserId}", id);

            return new UserDto
            {
                UserName = user.UserName,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Address = user.Address,
                Role = user.Role,
            };
        }

        public async Task<List<User>> GetUsersByRole(UserRole role)
        {
            _logger.LogInformation("GetUsersByRole started. Role: {Role}", role);
            return await _userRepository.GetUsersByRole(role);
        }

        public async Task<bool> UpdateUser(int id, UserUpdateDto dto)
        {
            _logger.LogInformation("UpdateUser started. UserId: {UserId}", id);

            var user = await _userRepository.GetUserById(id);
            if (user == null)
            {
                _logger.LogWarning("Update failed. User not found. UserId: {UserId}", id);
                return false;
            }

            user.UserName = dto.UserName ?? user.UserName;
            user.Name = dto.Name ?? user.Name;
            user.Email = dto.Email ?? user.Email;
            user.Phone = dto.Phone ?? user.Phone;
            user.Address = dto.Address ?? user.Address;
            user.Role = dto.Role ?? user.Role;

            var result = await _userRepository.UpdateUser(user);

            _logger.LogInformation("UpdateUser finished. Success: {Result}. UserId: {UserId}", result, id);
            return result;
        }

        public async Task<bool> DeleteUser(int id)
        {
            _logger.LogInformation("DeleteUser started. UserId: {UserId}", id);

            var result = await _userRepository.DeleteUser(id);

            if (!result)
                _logger.LogWarning("DeleteUser failed. UserId: {UserId}", id);
            else
                _logger.LogInformation("User deleted successfully. UserId: {UserId}", id);

            return result;
        }

        public async Task<List<UserDto>> GetBySort(string? name = null, string? email = null, string? prizeName = null)
        {
            _logger.LogInformation("GetBySort started. Name: {Name}, Email: {Email}, Prize: {Prize}",
                name, email, prizeName);

            var users = await _userRepository.GetBySort(name, email, prizeName);

            _logger.LogInformation("GetBySort returned {Count} users", users.Count);
            return users.Select(u => new UserDto
            {
                UserName = u.UserName,
                Name = u.Name,
                Email = u.Email,
                Phone = u.Phone,
                Address = u.Address,
                Role = u.Role,
            }).ToList();
        }

        public async Task<User?> GetUserByUserName(string userName)
        {
            _logger.LogInformation("GetUserByUserName started. UserName: {UserName}", userName);
            return await _userRepository.GetUserByUserName(userName);
        }
    }
}

