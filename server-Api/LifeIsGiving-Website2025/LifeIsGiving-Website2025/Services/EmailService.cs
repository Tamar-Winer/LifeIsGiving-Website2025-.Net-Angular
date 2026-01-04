using LifeIsGiving_Website2025.Interfaces;
using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendWinnerMail(string toEmail, string prizeName)
    {
        try
        {
            var fromEmail = _configuration["EmailSettings:From"];
            var password = _configuration["EmailSettings:Password"];

            var mail = new MailMessage();
            mail.From = new MailAddress(fromEmail, "Lottery System");
            mail.To.Add(toEmail);
            mail.Subject = "🎉 You are the winner!";

            mail.Body = $@"
                <html>
                <body style='font-family: Arial; direction:ltr;'>
                    <h2 style='color:green;'>Congratulations!</h2>
                    <p>You have won the prize:</p>
                    <h3>{prizeName}</h3>
                    <p>Thank you for participating.</p>
                    <br/>
                    <p><b>Lottery Management Team</b></p>
                </body>
                </html>";

            mail.IsBodyHtml = true;

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(fromEmail, password),
                EnableSsl = true
            };

            // השימוש ב־SendMailAsync מאפשר אסינכרוניות
            await smtp.SendMailAsync(mail);
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to send email", ex);
        }
    }
}
