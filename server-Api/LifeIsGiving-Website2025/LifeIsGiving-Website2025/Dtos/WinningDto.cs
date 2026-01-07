namespace LifeIsGiving_Website2025.Dtos
{
    public class WinningDto
    {
        public string PrizeName { get; set; }   = string.Empty;
        public string WinnerName { get; set; } = string.Empty;
        public DateTime LotteryDate { get; set; } = DateTime.Now;
    }
    public class WinningReportDto
    {
        public string PrizeName { get; set; } = string.Empty;
        public string WinnerName { get; set; } = string.Empty;
        public DateTime LotteryDate { get; set; } = DateTime.Now;
    }

}
