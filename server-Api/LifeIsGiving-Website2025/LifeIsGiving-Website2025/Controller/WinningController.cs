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
            await _winningService.RunLottery(prizeId);
            return Ok("Lottery completed successfully");
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
    }
}
