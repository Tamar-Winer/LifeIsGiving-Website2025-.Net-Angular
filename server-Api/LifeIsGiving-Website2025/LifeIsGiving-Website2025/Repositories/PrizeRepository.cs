using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeIsGiving_Website2025.Repositories
{
    public class PrizeRepository : IPrizeRepository
    {
        private readonly StoreContextDB _context;

        public PrizeRepository(StoreContextDB context)
        {
            _context = context;
        }

        public async Task<List<Prize>> GetPrizes(string? search = null)
        {
            var query = _context.Prizes.Include(p => p.Donor).AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Donor.Name.Contains(search)
                );
            }

            return await query.ToListAsync();
        }

        public async Task<Prize?> GetPrizeById(int id)
        {
            return await _context.Prizes
                .Include(p => p.Donor)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddPrize(Prize prize)
        {
            _context.Prizes.Add(prize);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePrize(Prize prize)
        {
            _context.Prizes.Update(prize);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePrize(Prize prize)
        {
            _context.Prizes.Remove(prize);
            await _context.SaveChangesAsync();
        }
        public async Task<List<PrizeSearchDto>> SearchPrizes(string? prizeName = null, string? donorName = null, int? minBuyers = null)
        {
            var query = _context.Prizes
                .Include(p => p.Donor)
                .Include(p => p.Purchases)
                .AsQueryable();

            if (!string.IsNullOrEmpty(prizeName))
                query = query.Where(p => p.Name.Contains(prizeName));

            if (!string.IsNullOrEmpty(donorName))
                query = query.Where(p => p.Donor.Name.Contains(donorName));

            if (minBuyers.HasValue)
                query = query.Where(p => p.Purchases.Count >= minBuyers.Value);

            var result = await query
                .Select(p => new PrizeSearchDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    DonorName = p.Donor.Name,
                    PurchasesCount = p.Purchases.Count
                })
                .ToListAsync();

            return result;
        }


    }
}
