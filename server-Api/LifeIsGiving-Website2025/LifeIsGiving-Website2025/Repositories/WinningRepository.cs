using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeIsGiving_Website2025.Repositories
{
    public class WinningRepository : IWinningRepository
    {
        private readonly StoreContextDB _context;

        public WinningRepository(StoreContextDB context)
        {
            _context = context;
        }

        public async Task Add(Winning winning)
        {
            await _context.Winnings.AddAsync(winning);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsForPrize(int prizeId)
        {
            return await _context.Winnings.AnyAsync(w => w.PrizeId == prizeId);
        }

        public async Task<List<Winning>> GetAll()
        {
            return await _context.Winnings
                .Include(w => w.Prize)
                .Include(w => w.WinnerUser)
                .ToListAsync();
        }
    }
}
