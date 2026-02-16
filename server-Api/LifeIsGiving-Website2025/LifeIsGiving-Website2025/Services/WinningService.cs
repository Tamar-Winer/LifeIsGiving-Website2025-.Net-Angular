using LifeIsGiving_Website2025.Data;
using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using Microsoft.EntityFrameworkCore;

namespace LifeIsGiving_Website2025.Services
{
    public class WinningService : IWinningService
    {
        private readonly IWinningRepository _winningRepository;
        private readonly StoreContextDB _context;
        private readonly IEmailService _emailService;

        public WinningService(
            IWinningRepository winningRepository,
            StoreContextDB context,
            IEmailService emailService)
        {
            _winningRepository = winningRepository;
            _context = context;
            _emailService = emailService;
        }

  public async Task<WinningReportDto> RunLottery(int prizeId)
{
    if (await _winningRepository.ExistsForPrize(prizeId))
        throw new Exception("Lottery already done for this prize");

    var purchases = await _context.Purchases
        .Where(p => p.PrizeId == prizeId)
        .ToListAsync();

    if (!purchases.Any())
        throw new Exception("No purchases for this prize");

    var tickets = new List<int>();
    foreach (var p in purchases)
    {
        for (int i = 0; i < p.Quantity; i++)
            tickets.Add(p.UserId);
    }

    var rnd = new Random();
    int winnerUserId = tickets[rnd.Next(tickets.Count)];

    var winning = new Winning
    {
        PrizeId = prizeId,
        WinnerUserId = winnerUserId,
        LotteryDate = DateTime.Now
    };

    await _winningRepository.Add(winning);
    
    // שליפת שם הזוכה ושם הפרס בשביל להחזיר לאנגולר
    var prize = await _context.Prizes.FirstOrDefaultAsync(p => p.Id == prizeId);
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == winnerUserId);

    if (prize != null)
    {
        prize.CanPurchase = false;
        _context.Prizes.Update(prize);
        await _context.SaveChangesAsync();
    }

    // כאן אנחנו מחזירים את האובייקט שהאנגולר מצפה לקבל
    return new WinningReportDto
    {
        PrizeName = prize?.Name,
        WinnerName = user?.Name, // וודאי שבמודל User קוראים לשם Name
        LotteryDate = winning.LotteryDate
    };
}        public async Task<List<WinningReportDto>> GetWinnersReport()
        {
            var winnings = await _winningRepository.GetAll();
            return winnings.Select(w => new WinningReportDto
            {
                PrizeName = w.Prize.Name,
                WinnerName = w.WinnerUser.Name,
                LotteryDate = w.LotteryDate
            }).ToList();
        }

        public async Task<decimal> GetTotalIncome()
        {
            return await _context.Purchases
                .SumAsync(p => p.Quantity * p.PriceAtPurchase);
        }



        public async Task<WinningReportDto> CheckIfDrawn(int prizeId)
{
    var winning = await _context.Winnings
        .Include(w => w.WinnerUser)
        .Include(w => w.Prize)
        .FirstOrDefaultAsync(w => w.PrizeId == prizeId);

    if (winning == null) return null;

    return new WinningReportDto
    {
        PrizeName = winning.Prize.Name,
        WinnerName = winning.WinnerUser.Name, // וודאי שבמודל User קוראים לזה Name
        LotteryDate = winning.LotteryDate
    };
}
    }
}
