using Microsoft.AspNetCore.Mvc;
using Server.BL;
using Server.Services;

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

        [HttpPost("pdf")]
        public IActionResult GeneratePdf([FromBody] TripPlan trip)
        {
            // אופציונלי: אם יש לך מידע יעד/תאריכים מהבקשה המקורית
            // תוכל להעביר לפונקציה כדי שיופיעו בכותרת
            byte[]? logo = System.IO.File.Exists("wwwroot/logo.png")
                ? System.IO.File.ReadAllBytes("wwwroot/logo.png")
                : null;

            var pdf = TripPdfBuilder.Build(
                trip: trip,
                destination: null, // אם יש לך – תשלח כאן
                startDate: null,
                endDate: null,
                logoPng: logo
            );

            var safeDest = "trip";
            var fileName = $"{safeDest}-{DateTime.UtcNow:yyyyMMdd}.pdf";
            return File(pdf, "application/pdf", fileName);
        }
    }
}
