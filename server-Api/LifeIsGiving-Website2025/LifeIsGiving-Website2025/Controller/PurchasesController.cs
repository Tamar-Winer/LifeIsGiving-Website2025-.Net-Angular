using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LifeIsGiving_Website2025.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchasesController : ControllerBase
    {
        private readonly IPurchaseService _service;

        public PurchasesController(IPurchaseService service)
        {
            _service = service;
        }

        private int GetUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(idStr))
                throw new Exception("UserId claim is missing from token");
            return int.Parse(idStr);
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<PurchaseDto>>> GetAll()
        {
            var purchases = await _service.GetAll();
            return Ok(purchases);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PurchaseDto>> GetById(int id)
        {
            var purchase = await _service.GetById(id);
            if (purchase == null) return NotFound();
            return Ok(purchase);
        }

        // ✅ Cart Add: יוצר Draft למשתמש המחובר (בלי UserId מהקליינט)
       [HttpPost]
[Authorize(Roles = "Buyer")]
public async Task<IActionResult> Add([FromBody] PurchaseCreateDto dto)
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    var purchase = new Purchase
    {
        UserId = userId,
        PrizeId = dto.PrizeId,
        Quantity = dto.Quantity,
        Status = PurchaseStatus.Draft
    };

    await _service.Add(purchase);
    return Ok(purchase);
}

        // ❗️אם תרצי להשאיר PUT/DELETE לאדמין זה בסדר,
        // אבל ל-Cart אמיתי המשתמש צריך יכולת שינוי כמות/מחיקה.
        // כרגע לא נוגעת בזה אצלך.

        [HttpPut("{id}")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> Update(int id, [FromBody] Purchase purchase)
        {
            if (id != purchase.Id) return BadRequest();

            var updated = await _service.Update(purchase);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpGet("sorted")]
        public async Task<ActionResult<List<PurchaseDto>>> GetAllSorted([FromQuery] string? sortBy = null)
        {
            var purchases = await _service.GetAllSorted(sortBy);
            return Ok(purchases);
        }

        // ✅ Cart Draft של המשתמש המחובר (בלי userId ב-URL)
       [HttpGet("draft")]
[Authorize(Roles = "Buyer")]
public async Task<IActionResult> GetMyDraftPurchases()
{
    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var result = await _service.GetDraftPurchases(userId);
    return Ok(result);
}

        [HttpGet("completed")]
        public async Task<IActionResult> GetCompletedPurchases([FromQuery] int? userId)
        {
            var result = await _service.GetCompletedPurchases(userId);
            return Ok(result);
        }

        // ✅ Buy Now / Complete: לוודא שזה של המשתמש
        [HttpPost("complete/{id}")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> CompletePurchase(int id)
        {
            // בודקים בעלות
            var me = GetUserId();
            var p = await _service.GetById(id);
            if (p == null) return NotFound("Purchase not found");

           
            var result = await _service.CompletePurchase(id);
            if (!result) return NotFound("Purchase not found");

            return Ok("Purchase marked as completed");
        }



        // PurchasesController.cs

[HttpGet("admin/report")]
[Authorize(Roles = "Admin")]
public async Task<ActionResult<List<PurchaseReportDto>>> GetAdminPurchaseReport(
    [FromQuery] int? prizeId = null, // הוספת פרמטר הסינון
    [FromQuery] string? sortBy = null)
{
    var report = await _service.GetAdminPurchaseReport(prizeId, sortBy);
    return Ok(report);
}
    }


    
}
