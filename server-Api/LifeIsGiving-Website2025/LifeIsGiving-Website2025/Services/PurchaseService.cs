
using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace LifeIsGiving_Website2025.Services
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IPurchaseRepository _repo;
        private readonly ILogger<PurchaseService> _logger;

        public PurchaseService(IPurchaseRepository repo, ILogger<PurchaseService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        private PurchaseDto MapToDto(Purchase p)
        {
            _logger.LogDebug("Mapping Purchase entity to DTO. PurchaseId: {PurchaseId}", p.Id);

            return new PurchaseDto
            {
                Id = p.Id,
                UserName = p.User.Name,
                PrizeName = p.Prize.Name,
                PrizeId = p.PrizeId,
                PrizeImageUrl = p.Prize?.ImageUrl,
                PriceAtPurchase = p.PriceAtPurchase,
                Quantity = p.Quantity,
                Status = p.Status.ToString(),
                CreatedAt = p.CreatedAt
            };
        }

        public async Task<List<PurchaseDto>> GetAll()
        {
            _logger.LogInformation("GetAll purchases started");

            try
            {
                var purchases = await _repo.GetAll();

                if (purchases == null || !purchases.Any())
                {
                    _logger.LogWarning("No purchases found in GetAll");
                    return new List<PurchaseDto>();
                }

                _logger.LogInformation("Retrieved {Count} purchases", purchases.Count);
                return purchases.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving all purchases");
                throw;
            }
        }

        public async Task<PurchaseDto?> GetById(int id)
        {
            _logger.LogInformation("GetById started. PurchaseId: {PurchaseId}", id);

            try
            {
                var purchase = await _repo.GetById(id);

                if (purchase == null)
                {
                    _logger.LogWarning("Purchase not found. PurchaseId: {PurchaseId}", id);
                    return null;
                }

                _logger.LogInformation("Purchase retrieved successfully. PurchaseId: {PurchaseId}", id);
                return MapToDto(purchase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving purchase {PurchaseId}", id);
                throw;
            }
        }

        public async Task Add(Purchase purchase)
        {
            _logger.LogInformation(
                "Add purchase started. UserId: {UserId}, PrizeId: {PrizeId}",
                purchase.UserId,
                purchase.PrizeId
            );

            try
            {
                await _repo.Add(purchase);
                _logger.LogInformation("Purchase added successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding purchase");
                throw;
            }
        }

        public async Task<bool> Update(Purchase purchase)
        {
            _logger.LogInformation("Update purchase started. PurchaseId: {PurchaseId}", purchase.Id);

            try
            {
                var result = await _repo.Update(purchase);

                if (!result)
                {
                    _logger.LogWarning("Purchase update failed. PurchaseId: {PurchaseId}", purchase.Id);
                }
                else
                {
                    _logger.LogInformation("Purchase updated successfully. PurchaseId: {PurchaseId}", purchase.Id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating purchase {PurchaseId}", purchase.Id);
                throw;
            }
        }

        public async Task<bool> CompletePurchase(int purchaseId)
        {
            _logger.LogInformation("CompletePurchase started. PurchaseId: {PurchaseId}", purchaseId);

            try
            {
                var result = await _repo.CompletePurchase(purchaseId);

                if (!result)
                {
                    _logger.LogWarning("CompletePurchase failed. PurchaseId: {PurchaseId}", purchaseId);
                }
                else
                {
                    _logger.LogInformation("Purchase completed successfully. PurchaseId: {PurchaseId}", purchaseId);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while completing purchase {PurchaseId}", purchaseId);
                throw;
            }
        }

        public async Task<bool> Delete(int id)
        {
            _logger.LogInformation("Delete purchase started. PurchaseId: {PurchaseId}", id);

            try
            {
                var result = await _repo.Delete(id);

                if (!result)
                {
                    _logger.LogWarning("Delete failed. PurchaseId: {PurchaseId}", id);
                }
                else
                {
                    _logger.LogInformation("Purchase deleted successfully. PurchaseId: {PurchaseId}", id);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting purchase {PurchaseId}", id);
                throw;
            }
        }

        public async Task<List<PurchaseDto>> GetAllSorted(string? sortBy = null)
        {
            _logger.LogInformation("GetAllSorted started. SortBy: {SortBy}", sortBy ?? "default");

            try
            {
                var purchases = await _repo.GetAllSorted(sortBy);

                _logger.LogInformation("Retrieved {Count} sorted purchases", purchases.Count);
                return purchases.Select(MapToDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while sorting purchases. SortBy: {SortBy}", sortBy);
                throw;
            }
        }

        public async Task<List<PurchaseDto>> GetDraftPurchases(int userId)
        {
            _logger.LogInformation("GetDraftPurchases started. UserId: {UserId}", userId);

            try
            {
                var purchases = await _repo.GetDraftPurchases(userId);

                if (purchases == null || !purchases.Any())
                {
                    _logger.LogWarning("No draft purchases found for UserId {UserId}", userId);
                    return new List<PurchaseDto>();
                }

                _logger.LogInformation(
                    "Retrieved {Count} draft purchases for UserId {UserId}",
                    purchases.Count,
                    userId
                );

                return purchases.Select(p => new PurchaseDto
                {
                    Id = p.Id,
                    UserName = p.User.Name,
                    PrizeId = p.PrizeId,
                    PrizeName = p.Prize != null ? p.Prize.Name : "Unknown",
                    PrizeImageUrl = p.Prize?.ImageUrl,
                    PriceAtPurchase = p.PriceAtPurchase,
                    Quantity = p.Quantity,
                    Status = p.Status.ToString(),
                    CreatedAt = p.CreatedAt
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving draft purchases for UserId {UserId}", userId);
                throw;
            }
        }

        public async Task<List<PurchaseDto>> GetCompletedPurchases(int? userId = null)
        {
            _logger.LogInformation(
                "GetCompletedPurchases started. UserId: {UserId}",
                userId.HasValue ? userId.Value : -1
            );

            try
            {
                var purchases = await _repo.GetCompletedPurchases(userId);

                if (purchases == null || !purchases.Any())
                {
                    _logger.LogWarning(
                        "No completed purchases found. UserId: {UserId}",
                        userId.HasValue ? userId.Value : -1
                    );
                    return new List<PurchaseDto>();
                }

                _logger.LogInformation(
                    "Retrieved {Count} completed purchases. UserId: {UserId}",
                    purchases.Count,
                    userId.HasValue ? userId.Value : -1
                );

                return purchases.Select(p => new PurchaseDto
                {
                    Id = p.Id,
                    UserName = p.User.Name,
                    PrizeId = p.PrizeId,
                    PrizeName = p.Prize.Name,
                    PriceAtPurchase = p.PriceAtPurchase,
                    Quantity = p.Quantity,
                    Status = p.Status.ToString(),
                    CreatedAt = p.CreatedAt
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error occurred while retrieving completed purchases. UserId: {UserId}",
                    userId.HasValue ? userId.Value : -1
                );
                throw;
            }
        }

// בתוך PurchaseService.cs

public async Task<List<PurchaseReportDto>> GetAdminPurchaseReport(int? prizeId, string? sortBy)
{
    _logger.LogInformation("GetAdminPurchaseReport started. PrizeId: {PrizeId}, SortBy: {SortBy}", prizeId, sortBy ?? "default");

    try
    {
        // שליפת הנתונים המסוננים
        var purchases = await _repo.GetAdminReportData(prizeId, sortBy);

        return purchases.Select(p => new PurchaseReportDto
        {
            PurchaseId = p.Id,
            PrizeName = p.Prize?.Name ?? "Unknown",
            UnitPrice = p.Prize?.Price ?? 0,
            Quantity = p.Quantity,
            TotalAmount = p.Quantity * (p.Prize?.Price ?? 0),
            CustomerFullName = p.User != null ? $"{p.User.Name}" : "Unknown User",
            CustomerEmail = p.User?.Email ?? "N/A"
        }).ToList();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred while generating admin purchase report");
        throw;
    }
}
    }
}
