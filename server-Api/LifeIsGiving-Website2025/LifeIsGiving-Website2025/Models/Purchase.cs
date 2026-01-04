using LifeIsGiving_Website2025.Models.Enums;
using System;

namespace LifeIsGiving_Website2025.Models
{
    public class Purchase
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int PrizeId { get; set; }
        public Prize Prize { get; set; }

        public int Quantity { get; set; }

        // המחיר נשמר בזמן הרכישה
        public decimal PriceAtPurchase { get; set; }

        public PurchaseStatus Status { get; set; } = PurchaseStatus.Draft;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
