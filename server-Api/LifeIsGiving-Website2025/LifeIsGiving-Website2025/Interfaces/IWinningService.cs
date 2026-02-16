using LifeIsGiving_Website2025.Dtos;

namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IWinningService
    {
        Task<List<WinningReportDto>> GetWinnersReport();
        Task<decimal> GetTotalIncome();
       Task<WinningReportDto> RunLottery(int prizeId);
       Task<WinningReportDto> CheckIfDrawn(int prizeId);
    }
}
