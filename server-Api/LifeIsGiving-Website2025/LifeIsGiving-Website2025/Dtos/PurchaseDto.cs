namespace LifeIsGiving_Website2025.Dtos
{
    using System;

    namespace LifeIsGiving_Website2025.Dtos
    {
        public class PurchaseDto
        {
            public int Id { get; set; }
            public string UserName { get; set; }      // שם המשתמש בלבד
            public string PrizeName { get; set; }
            public decimal PriceAtPurchase { get; set; }
            public int Quantity { get; set; }
            public string Status { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class PurchaseCreateDto
        {
            public int UserId { get; set; }
            public int PrizeId { get; set; }
            public int Quantity { get; set; }
        }

    }


}
