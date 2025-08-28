using Microsoft.AspNetCore.Mvc;
using Server.BL;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AIController : ControllerBase
    {
        private readonly GeminiService _gemini;

        public AIController(GeminiService gemini)
        {
            _gemini = gemini;
        }

        [HttpPost("preview")]
        public async Task<ActionResult<ItineraryDto>> Preview([FromBody] TripInputDto input, CancellationToken ct)
        {
            if (input.StartDate > input.EndDate)
                return BadRequest("StartDate must be <= EndDate");

            try
            {
                var itin = await _gemini.GenerateItineraryAsync(input, ct);
                return Ok(itin);
            }
            catch (Exception ex)
            {
                return StatusCode(502, new { error = "Gemini generation failed", detail = ex.Message });
            }
        }
    }
}
