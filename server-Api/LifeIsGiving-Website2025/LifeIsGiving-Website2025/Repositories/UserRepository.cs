using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;
using LifeIsGiving_Website2025.Models.Enums;

namespace LifeIsGiving_Website2025.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly StoreContextDB _storeContext;

        public UserRepository(StoreContextDB storeContext)
        {
            _storeContext = storeContext;
        }

        public async Task<List<User>> GetBuyers()
        {
            return await _storeContext.Users
                .Where(u => u.Role == UserRole.Buyer)
                .Include(u => u.Winnings)
                    .ThenInclude(w => w.Prize)
                .Include(u => u.Purchases)
                    .ThenInclude(p => p.Prize)
                .ToListAsync();
        }
        public async Task<List<User>> GetUsers()
        {
            return await _storeContext.Users
                .Include(u => u.Winnings)
                    .ThenInclude(w => w.Prize)
                .Include(u => u.Purchases)
                    .ThenInclude(p => p.Prize)
                .Include(u => u.PrizesDonated)
                .ToListAsync();
        }


        public async Task<List<User>> GetDonors()
        {
            return await _storeContext.Users
                .Where(u => u.Role == UserRole.Donor)
                .Include(u => u.PrizesDonated)
                .ToListAsync();
        }



        public async Task AddUser(User user)
        {
            await _storeContext.Users.AddAsync(user);
            await _storeContext.SaveChangesAsync();
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _storeContext.Users
                .Include(u => u.PrizesDonated)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetBuyerById(int id)
        {
            return await _storeContext.Users
                .Where(u => u.Role == UserRole.Buyer && u.Id == id)
                .Include(u => u.Winnings)
                    .ThenInclude(w => w.Prize)
                .Include(u => u.Purchases)
                    .ThenInclude(p => p.Prize)
                .FirstOrDefaultAsync();
        }

        public async Task<User?> GetDonorById(int id)
        {
            return await _storeContext.Users
                .Where(u => u.Role == UserRole.Donor && u.Id == id)
                .Include(u => u.PrizesDonated)
                .FirstOrDefaultAsync();
        }


        public async Task<List<User>> GetUsersByRole(UserRole role)
        {
            return await _storeContext.Users
                                .Where(u => u.Role == role)
                                .ToListAsync();
        }

        public async Task<bool> UpdateUser(User user)
        {
            var existingUser = await _storeContext.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
            if (existingUser == null) return false;

            _storeContext.Entry(existingUser).CurrentValues.SetValues(user);
            await _storeContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = await _storeContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return false;

            _storeContext.Users.Remove(user);
            await _storeContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<User>> GetBySort(string? name = null, string? email = null, string? prizeName = null)
        {
            var query = _storeContext.Users
                .Include(u => u.PrizesDonated)
                .AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(u => u.Name.Contains(name));

            if (!string.IsNullOrEmpty(email))
                query = query.Where(u => u.Email.Contains(email));

            if (!string.IsNullOrEmpty(prizeName))
                query = query.Where(u => u.PrizesDonated.Any(p => p.Name.Contains(prizeName)));

            return await query.ToListAsync();
        }

        public async Task<User?> GetUserByUserName(string userName)
        {
            return await _storeContext.Users
                .FirstOrDefaultAsync(u => u.UserName == userName);
        }

    }
}
