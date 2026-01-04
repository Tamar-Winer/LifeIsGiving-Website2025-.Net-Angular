using LifeIsGiving_Website2025.Models;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IWinningRepository
    {
        Task Add(Winning winning);
        Task<bool> ExistsForPrize(int prizeId);
        Task<List<Winning>> GetAll();
    }
}
