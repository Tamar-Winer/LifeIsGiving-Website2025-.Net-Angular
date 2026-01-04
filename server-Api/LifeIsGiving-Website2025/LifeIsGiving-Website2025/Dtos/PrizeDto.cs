using LifeIsGiving_Website2025.Models.Enums;
using LifeIsGiving_Website2025.Models;
using System.ComponentModel.DataAnnotations;

namespace LifeIsGiving_Website2025.Dtos
{
    public class PrizeDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public PrizeCategory Category { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be non-negative")]
        public decimal Price { get; set; }

        [Url(ErrorMessage = "ImageUrl must be a valid URL")]
        public string? ImageUrl { get; set; }

        [Required]
        public int DonorId { get; set; }
    }

    public class PrizeCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(500)]
        public string Description { get; set; }

        [Required]
        public PrizeCategory Category { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        [Url]
        public string? ImageUrl { get; set; }

        [Required]
        public int DonorId { get; set; }
    }

    public class PrizeSearchDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string DonorName { get; set; }
        public int PurchasesCount { get; set; }  // סך הרכישות
    }


}
