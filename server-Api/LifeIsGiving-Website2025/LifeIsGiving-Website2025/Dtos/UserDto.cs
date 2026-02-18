using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace LifeIsGiving_Website2025.Dtos
{
    public class UserDto
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Address { get; set; } = string.Empty;

        //[Required]
        //[MaxLength(256)]
        //public string Password { get; set; }
        public UserRole Role { get; set; }
        public List<PurchaseDto> Purchases { get; set; } = new List<PurchaseDto>();
        public List<WinningDto> Winnings { get; set; } = new List<WinningDto>();



    }

    public class UserCreateDto
    {
        [Required]
        public string UserName { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        public string? Phone { get; set; }
        public string? Address { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [MaxLength(50)]
        
        public string Password { get; set; } = null!;

        [Required]
        public UserRole Role { get; set; }

    }

    public class UserUpdateDto
    {
        public string? UserName { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public UserRole? Role { get; set; }
    }
    public class UserDonorDto 
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Address { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public List<PrizeDto> PrizesDonated { get; set; } = new List<PrizeDto>();
        

    }

}
