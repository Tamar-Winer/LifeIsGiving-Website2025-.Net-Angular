using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace LifeIsGiving_Website2025.Repositories
{
    public class PurchaseRepository : IPurchaseRepository
    {
        private readonly StoreContextDB _context;

        public PurchaseRepository(StoreContextDB context)
        {
            _context = context;
        }

        public async Task<List<Purchase>> GetAll()
        {
            return await _context.Purchases
                                 .Include(p => p.User)
                                 .Include(p => p.Prize)
                                 .ToListAsync();
        }

        public async Task<Purchase?> GetById(int id)
        {
            return await _context.Purchases
                                 .Include(p => p.User)
                                 .Include(p => p.Prize)
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task Add(Purchase purchase)
        {
            var prize = await _context.Prizes.FirstOrDefaultAsync(p => p.Id == purchase.PrizeId);
            if (prize == null)
                throw new Exception("Prize not found");

            // --- ביטול החסימה זמנית לצורך פיתוח ובדיקות ---
            // if (!prize.CanPurchase)
            //    throw new Exception("Cannot purchase this prize. Lottery already done or purchasing disabled.");
            // ----------------------------------------------

            // ✅ קיבוע מחיר בזמן יצירת Draft
            purchase.PriceAtPurchase = prize.Price;

            // ✅ Upsert Draft: אם כבר יש Draft לאותו משתמש + אותו פרס ← מגדילים Quantity
            var existing = await _context.Purchases.FirstOrDefaultAsync(p =>
                p.UserId == purchase.UserId &&
                p.PrizeId == purchase.PrizeId &&
                p.Status == PurchaseStatus.Draft
            );

            if (existing != null)
            {
                existing.Quantity += purchase.Quantity;
                if (existing.Quantity < 1) existing.Quantity = 1;

                await _context.SaveChangesAsync();
                return;
            }

            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> Update(Purchase purchase)
        {
            var existing = await _context.Purchases.FirstOrDefaultAsync(p => p.Id == purchase.Id);
            if (existing == null) return false;

            _context.Entry(existing).CurrentValues.SetValues(purchase);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CompletePurchase(int purchaseId)
        {
            var existing = await _context.Purchases.FirstOrDefaultAsync(p => p.Id == purchaseId);
            if (existing == null) return false;

            existing.Status = PurchaseStatus.Completed;

            _context.Purchases.Update(existing);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var purchase = await _context.Purchases.FirstOrDefaultAsync(p => p.Id == id);
            if (purchase == null) return false;

            if (purchase.Status != PurchaseStatus.Draft)
                return false;  

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Purchase>> GetAllSorted(string? sortBy = null)
        {
            var query = _context.Purchases
                                .Include(p => p.User)
                                .Include(p => p.Prize)
                                .AsQueryable();

            if (sortBy == "PriceDesc")
                query = query.OrderByDescending(p => p.PriceAtPurchase);
            else if (sortBy == "QuantityDesc")
                query = query.OrderByDescending(p => p.Quantity);

            return await query.ToListAsync();
        }

        public async Task<List<Purchase>> GetDraftPurchases(int userId)
        {
            return await _context.Purchases
                .Where(p => p.UserId == userId && p.Status == PurchaseStatus.Draft)
                .Include(p => p.Prize)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<List<Purchase>> GetCompletedPurchases(int? userId = null)
        {
            var query = _context.Purchases
                .Where(p => p.Status == PurchaseStatus.Completed)
                .Include(p => p.Prize)
                .Include(p => p.User)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(p => p.UserId == userId.Value);

            return await query.ToListAsync();
        }


        // בתוך PurchaseRepository.cs
public async Task<List<Purchase>> GetAdminReportData(int? prizeId, string? sortBy)
{
    var query = _context.Purchases
        .Include(p => p.User)
        .Include(p => p.Prize)
        .Where(p => p.Status == PurchaseStatus.Completed);

    // סינון לפי פרס ספציפי במידה ונשלח ID
    if (prizeId.HasValue)
    {
        query = query.Where(p => p.PrizeId == prizeId.Value);
    }

    // מיון
    query = sortBy switch
    {
        "most_expensive" => query.OrderByDescending(p => p.Prize.Price),
        "most_purchased" => query.OrderByDescending(p => p.Quantity),
        "prize_name" => query.OrderBy(p => p.Prize.Name),
        _ => query.OrderByDescending(p => p.CreatedAt)
    };

    return await query.ToListAsync();
}
    }
}