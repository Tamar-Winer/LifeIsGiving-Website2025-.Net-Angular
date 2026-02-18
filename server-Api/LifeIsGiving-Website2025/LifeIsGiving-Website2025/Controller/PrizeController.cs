using LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LifeIsGiving_Website2025.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrizeController : ControllerBase
    {
        private readonly IPrizeService _service;

        public PrizeController(IPrizeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPrizes([FromQuery] string? search = null)
        {
            var prizes = await _service.GetPrizes(search);
            return Ok(prizes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPrizeById(int id)
        {
            var prize = await _service.GetPrizeById(id);
            if (prize == null) return NotFound();
            return Ok(prize);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddPrize([FromBody] PrizeCreateDto dto)
        {
            await _service.AddPrize(dto);
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePrize(int id, [FromBody] PrizeCreateDto dto)
        {
            await _service.UpdatePrize(id, dto);
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePrize(int id)
        {
            await _service.DeletePrize(id);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchPrizes([FromQuery] string? prizeName, [FromQuery] string? donorName, [FromQuery] int? exactBuyers)
        {
            var results = await _service.SearchPrizes(prizeName, donorName, exactBuyers);
            return Ok(results);
        }


        [HttpPost("upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0) return BadRequest("No file uploaded");

            // 1. יצירת נתיב לתיקיית wwwroot/uploads
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

            // 2. יצירת שם ייחודי לקובץ כדי למנוע דריסה
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsPath, fileName);

            // 3. שמירת הקובץ פיזית בשרת
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 4. החזרת ה-URL המלא (הדפדפן ישתמש בזה)
            var fileUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { url = fileUrl });
        }

    }
}
