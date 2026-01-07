using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IPurchaseService
    {
        Task<List<PurchaseDto>> GetAll();
        Task<PurchaseDto?> GetById(int id);
        Task Add(Purchase purchase);
        Task<bool> Update(Purchase purchase);
        Task<bool> CompletePurchase(int purchaseId);

        Task<bool> Delete(int id);
        Task<List<PurchaseDto>> GetAllSorted(string? sortBy = null);
        Task<List<PurchaseDto>> GetDraftPurchases(int userId);
        Task<List<PurchaseDto>> GetCompletedPurchases(int? userId = null);
    }
}
