using LifeIsGiving_Website2025.Dtos;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IWinningService
    {
        Task RunLottery(int prizeId);
        Task<List<WinningReportDto>> GetWinnersReport();
        Task<decimal> GetTotalIncome();
    }
}
