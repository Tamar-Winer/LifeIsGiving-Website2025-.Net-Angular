using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LifeIsGiving_Website2025.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userService.GetUserByUserName(dto.UserName);

            if (user == null)
                return Unauthorized("Invalid username or password");

            var passwordResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.Password,
                dto.Password
            );

            if (passwordResult == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid username or password");

            // קביעת Role לפי ה־enum שלך
            string role = user.Role switch
            {
                UserRole.Admin => "Admin",
                UserRole.Buyer => "Buyer",
                UserRole.Donor => "Donor",
                _ => "Buyer"
            };

           var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // ✅ NEW: userId בטוקן
    new Claim(ClaimTypes.Name, user.UserName),
    new Claim(ClaimTypes.Role, role)
};


            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])
            );

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(_configuration["JwtSettings:ExpiryMinutes"])
                ),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                token = jwt,
                role = role
            });
        }


    }
}
