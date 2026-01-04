using LifeIsGiving_Website2025.Models.Enums;

namespace LifeIsGiving_Website2025.Models
{
    public class Winning
    {
        public int Id { get; set; }
        public int PrizeId { get; set; }
        public Prize Prize { get; set; }

        public int WinnerUserId { get; set; }
        public User WinnerUser { get; set; }

        public DateTime LotteryDate { get; set; }
        public WinningStatus WinningStatus { get; set; }
    }
}
