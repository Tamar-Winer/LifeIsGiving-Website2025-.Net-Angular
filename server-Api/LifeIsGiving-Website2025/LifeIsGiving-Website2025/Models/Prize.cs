using LifeIsGiving_Website2025.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace LifeIsGiving_Website2025.Models
{
        [Table("Prizes")]
        public class Prize
        {
            public int Id { get; set; }
            public string Name { get; set; }     
            public string Description { get; set; }
            public PrizeCategory Category { get; set; }      
            public decimal Price { get; set; }   
            public string? ImageUrl { get; set; }   
            public int DonorId { get; set; }
            public User Donor { get; set; }
            public ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
        public bool CanPurchase { get; set; } = true;


    }

}
