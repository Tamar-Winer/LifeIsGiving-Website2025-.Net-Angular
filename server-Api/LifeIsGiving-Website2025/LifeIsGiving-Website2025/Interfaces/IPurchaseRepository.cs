using LifeIsGiving_Website2025.Models;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IPurchaseRepository
    {
        Task<List<Purchase>> GetAll();
        Task<Purchase?> GetById(int id);
        Task Add(Purchase purchase);
        Task<bool> Update(Purchase purchase);
        Task<bool> CompletePurchase(int purchaseId);

        Task<bool> Delete(int id);
        Task<List<Purchase>> GetAllSorted(string sortBy = null);
        Task<List<Purchase>> GetDraftPurchases(int userId);     
        Task<List<Purchase>> GetCompletedPurchases(int? userId = null);
    }
}
