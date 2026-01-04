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

        public async Task RunLottery(int prizeId)
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
            var prize = await _context.Prizes.FirstOrDefaultAsync(p => p.Id == prizeId);
            if (prize != null)
            {
                prize.CanPurchase = false;
                _context.Prizes.Update(prize);
                await _context.SaveChangesAsync();
            }

            //// שליחת מייל
            //var winner = await _context.Users.FirstAsync(u => u.Id == winnerUserId);
            //var prize = await _context.Prizes.FirstAsync(p => p.Id == prizeId);

            //await _emailService.SendWinnerMail(winner.Email, prize.Name);
        }

        public async Task<List<WinningReportDto>> GetWinnersReport()
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
    }
}
