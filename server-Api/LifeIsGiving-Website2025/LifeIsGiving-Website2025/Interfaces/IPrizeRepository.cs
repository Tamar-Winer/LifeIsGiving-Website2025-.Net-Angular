using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IPrizeRepository
    {
        Task<List<Prize>> GetPrizes(string? search = null);
        Task<Prize?> GetPrizeById(int id);
        Task AddPrize(Prize prize);
        Task UpdatePrize(Prize prize);
        Task DeletePrize(Prize prize);
        Task<List<PrizeSearchDto>> SearchPrizes(string? prizeName = null, string? donorName = null, int? exactBuyers = null);


    }
}
