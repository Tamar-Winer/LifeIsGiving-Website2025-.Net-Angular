namespace LifeIsGiving_Website2025.Interfaces
{
    public interface IEmailService
    {
        Task SendWinnerMail(string toEmail, string prizeName);
    }
}
