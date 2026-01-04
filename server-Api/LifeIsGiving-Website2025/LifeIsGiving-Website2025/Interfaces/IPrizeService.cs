using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IPrizeService
    {
        Task<List<PrizeDto>> GetPrizes(string? search = null);
        Task<PrizeDto?> GetPrizeById(int id);
        Task AddPrize(PrizeCreateDto dto);
        Task UpdatePrize(int id, PrizeCreateDto dto);
        Task DeletePrize(int id);
        Task<List<PrizeSearchDto>> SearchPrizes(string? prizeName = null, string? donorName = null, int? exactBuyers = null);

    }
}
