namespace LifeIsGiving_Website2025.Dtos
{
    using System;

    namespace LifeIsGiving_Website2025.Dtos
    {
       public class PurchaseDto
{
    public int Id { get; set; }
    public int PrizeId { get; set; } // <--- תוסיפי את השורה הזו!
    public string UserName { get; set; } = string.Empty;
    public string PrizeName { get; set; } = string.Empty;
    public decimal PriceAtPurchase { get; set; }
    public int Quantity { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
        public class PurchaseCreateDto
        {
            public int PrizeId { get; set; }
            public int Quantity { get; set; }
        }

      public class PurchaseReportDto
{
    public int PurchaseId { get; set; }
    public string ?PrizeName { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
    public string ?CustomerFullName { get; set; }
    public string ?CustomerEmail { get; set; }
}
    }


}
