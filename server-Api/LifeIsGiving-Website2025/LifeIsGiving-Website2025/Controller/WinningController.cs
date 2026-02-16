using LifeIsGiving_Website2025.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LifeIsGiving_Website2025.Controller
{
  
    [ApiController]
    [Route("api/[controller]")]
    public class WinningController : ControllerBase
    {
        private readonly IWinningService _winningService;

        public WinningController(IWinningService winningService)
        {
            _winningService = winningService;
        }

        [HttpPost("run/{prizeId}")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> RunLottery(int prizeId)
        {
           try 
    {
        var winner = await _winningService.RunLottery(prizeId);
        return Ok(winner); // תחזירי את ה-Dto של הזוכה שנוצר עכשיו
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
        }

        [HttpGet("winners-report")]
        public async Task<IActionResult> GetWinnersReport()
        {
            var report = await _winningService.GetWinnersReport();
            return Ok(report);
        }

        [HttpGet("total-income")]
        [Authorize(Roles = "Admin")]

        public async Task<IActionResult> GetTotalIncome()
        {
            var total = await _winningService.GetTotalIncome();
            return Ok(total);
        }


        [HttpGet("check/{prizeId}")]
public async Task<IActionResult> CheckIfDrawn(int prizeId)
{
    // אנחנו משתמשים בשירות כדי לבדוק אם קיימת רשומה בטבלת Winnings
    var exists = await _winningService.CheckIfDrawn(prizeId);
    
    // אם קיים, נחזיר את פרטי הזכייה. אם לא, נחזיר null או false
    if (exists != null)
    {
        return Ok(exists);
    }
    return Ok(null);
}
    }
}
