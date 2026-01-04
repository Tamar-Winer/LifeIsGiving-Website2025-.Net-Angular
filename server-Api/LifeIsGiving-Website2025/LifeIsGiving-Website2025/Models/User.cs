using LifeIsGiving_Website2025.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeIsGiving_Website2025.Models
{
    [Table("Users")]
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Name { get; set; }    
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string? Address { get; set; }
        public UserRole Role { get; set; }
        public ICollection<Prize> PrizesDonated { get; set; } = new List<Prize>();
        public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public ICollection<Winning> Winnings { get; set; } = new List<Winning>();


    }
}
