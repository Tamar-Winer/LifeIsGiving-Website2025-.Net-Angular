using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeIsGiving_Website2025.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<List<UserDto>>> GetUsers()
        {
            var users = await _userService.GetUsers();
            return Ok(users);
        }


        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] UserCreateDto userDto)
        {
            await _userService.AddUser(userDto);
            return Ok();
        }

        [HttpGet("{Id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int Id)
        {
            var user = await _userService.GetUserById(Id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpGet("by-role/{role}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersByRole(UserRole role)
        {
            var users = await _userService.GetUsersByRole(role);
            return Ok(users);
        }


        [HttpGet("buyers")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserDto>>> GetBuyers()
        {
            return Ok(await _userService.GetBuyers());
        }

        [HttpGet("buyers/{id}")]
        public async Task<ActionResult<UserDto>> GetBuyerById(int id)
        {
            var buyer = await _userService.GetBuyerById(id);
            if (buyer == null) return NotFound();
            return Ok(buyer);
        }


        [HttpGet("donors")]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<List<UserDonorDto>>> GetDonors()
        {
            return Ok(await _userService.GetDonors());
        }

        [HttpGet("donors/{id}")]

        public async Task<ActionResult<UserDonorDto>> GetDonorById(int id)
        {
            var donor = await _userService.GetDonorById(id);
            if (donor == null) return NotFound();
            return Ok(donor);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _userService.UpdateUser(id, dto);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var deleted = await _userService.DeleteUser(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpGet("/filteringBy")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBySort([FromQuery] string? name, [FromQuery] string? email, [FromQuery] string? prizeName)
        {
            var donors = await _userService.GetBySort(name, email, prizeName);
            return Ok(donors);
        }


    }
}
