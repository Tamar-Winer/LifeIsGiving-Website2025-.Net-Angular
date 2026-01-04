using LifeIsGiving_Website2025.Dtos.LifeIsGiving_Website2025.Dtos;
using LifeIsGiving_Website2025.Interfaces;
using LifeIsGiving_Website2025.Models;
using LifeIsGiving_Website2025.Models.Enums;
using LifeIsGiving_Website2025.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] PurchaseCreateDto dto)
        {
            //var purchase = new Purchase
            //{
            //    UserId = dto.UserId,
            //    PrizeId = dto.PrizeId,
            //    Quantity = dto.Quantity,
            //    Status = PurchaseStatus.Draft
            //};

            //await _service.Add(purchase);
            //return CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
            try
            {
                var purchase = new Purchase
                {
                    UserId = dto.UserId,
                    PrizeId = dto.PrizeId,
                    Quantity = dto.Quantity,
                    Status = PurchaseStatus.Draft
                };

                await _service.Add(purchase);
                return Ok(purchase);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Update(int id, [FromBody] Purchase purchase)
        {
            if (id != purchase.Id) return BadRequest();

            var updated = await _service.Update(purchase);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.Delete(id);
            if (!deleted) return NotFound();

            return NoContent();
        }

        [HttpGet("sorted")]
        public async Task<ActionResult<List<PurchaseDto>>> GetAllSorted([FromQuery] string sortBy = null)
        {
            var purchases = await _service.GetAllSorted(sortBy);
            return Ok(purchases);
        }

        // GET /api/purchases/draft/{customerId}
        [HttpGet("draft/{userId}")]
        [Authorize(Roles = "Buyer")] // רק ללקוח
        public async Task<IActionResult> GetDraftPurchases(int userId)
        {
            var result = await _service.GetDraftPurchases(userId);
            return Ok(result);
        }

        [HttpGet("completed")]
        public async Task<IActionResult> GetCompletedPurchases([FromQuery] int? userId)
        {
            var result = await _service.GetCompletedPurchases(userId);
            return Ok(result);
        }

        [HttpPost("complete/{id}")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> CompletePurchase(int id)
        {
            var result = await _service.CompletePurchase(id);
            if (!result) return NotFound("Purchase not found");

            return Ok("Purchase marked as completed");
        }



    }
}
