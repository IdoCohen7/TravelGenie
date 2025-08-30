using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Linq;
using Microsoft.Extensions.Options;
using Server.BL;

namespace Server.Services
{
    public class GeminiService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _model;

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public GeminiService(HttpClient http, IOptions<GeminiOptions> opts)
        {
            _http = http;
            _model = opts.Value.Model;   // gemini-2.0-flash
            _apiKey = opts.Value.ApiKey;
            if (string.IsNullOrWhiteSpace(_apiKey))
                throw new InvalidOperationException("Gemini ApiKey missing from configuration");
        }

        public async Task<ItineraryDto> GenerateItineraryAsync(TripInputDto trip, CancellationToken ct = default)
        {
            var prompt = BuildPrompt(trip);

            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        role = "user",
                        parts = new[] { new { text = prompt } }
                    }
                }
            };

            // שימוש ב-URL מוחלט + API Key בכותרת (כך עובדים המדריכים של גוגל)
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent";

            using var req = new HttpRequestMessage(HttpMethod.Post, url);
            req.Headers.Add("x-goog-api-key", _apiKey);
            req.Content = JsonContent.Create(requestBody);

            using var res = await _http.SendAsync(req, ct);
            var raw = await res.Content.ReadAsStringAsync(ct);

            if (!res.IsSuccessStatusCode)
                throw new InvalidOperationException($"Gemini HTTP {(int)res.StatusCode}: {raw}");

            var env = JsonSerializer.Deserialize<GeminiEnvelope>(raw, JsonOpts)
                      ?? throw new InvalidOperationException("Empty Gemini response");

            var text = env.Candidates?
                           .FirstOrDefault()?
                           .Content?
                           .Parts?
                           .FirstOrDefault()?
                           .Text;

            if (string.IsNullOrWhiteSpace(text))
                throw new InvalidOperationException("Gemini returned no text");

            var json = ExtractJson(text!);

            var itinerary = JsonSerializer.Deserialize<ItineraryDto>(json, JsonOpts)
                            ?? throw new InvalidOperationException("Failed to parse itinerary JSON");

            if (itinerary.Days == null || itinerary.Days.Count == 0)
                throw new InvalidOperationException("Itinerary has no days");

            for (int i = 0; i < itinerary.Days.Count; i++)
                if (itinerary.Days[i].DayIndex <= 0) itinerary.Days[i].DayIndex = i + 1;

            return itinerary;
        }

        private static string BuildPrompt(TripInputDto t)
        {
            var sb = new StringBuilder();
            sb.AppendLine("You are a travel planner. Output STRICT JSON only, matching the schema. No prose.");
            sb.AppendLine($"Destination: {t.Destination}");
            sb.AppendLine($"Dates: {t.StartDate:yyyy-MM-dd} to {t.EndDate:yyyy-MM-dd}");
            sb.AppendLine("The currency should always be only us dollars, if the user entered a destination value that isn't a known city or country - return an error");
            sb.AppendLine($"GroupType: {t.GroupType}");
            sb.AppendLine($"GroupSize: {t.Pax}");
            if (!string.IsNullOrWhiteSpace(t.BudgetTier))
                sb.AppendLine($"BudgetTier: {t.BudgetTier}");
            if (t.Preferences?.Any() == true)
                sb.AppendLine("Preferences: " + string.Join(", ", t.Preferences));

            sb.AppendLine(@"
Return ONLY this JSON:
{
  ""currency"": ""string"",
  ""totalEstCost"": null,
  ""days"": [
    {
      ""dayIndex"": 1,
      ""summary"": ""string"",
      ""items"": [
        {
          ""startTime"": ""HH:MM"",
          ""endTime"": ""HH:MM"",
          ""title"": ""string"",
          ""location"": ""string"",
          ""notes"": ""string"",
          ""estCost"": null
        }
      ]
    }
  ]
}");
            return sb.ToString();
        }

        private static string ExtractJson(string text)
        {
            text = text.Trim();

            if (text.StartsWith("{") && text.EndsWith("}"))
                return text;

            var fenced = Regex.Match(text, "```json\\s*(\\{[\\s\\S]*?\\})\\s*```", RegexOptions.IgnoreCase);
            if (fenced.Success) return fenced.Groups[1].Value;

            var fencedAny = Regex.Match(text, "```\\s*(\\{[\\s\\S]*?\\})\\s*```", RegexOptions.IgnoreCase);
            if (fencedAny.Success) return fencedAny.Groups[1].Value;

            var curly = Regex.Match(text, "(\\{[\\s\\S]*\\})");
            if (curly.Success) return curly.Groups[1].Value;

            return text;
        }
    }

    // POCOs למעטפת תגובת Gemini
    public record GeminiEnvelope(List<Candidate>? Candidates);
    public record Candidate(Content? Content);
    public record Content(List<Part>? Parts);
    public record Part(string? Text);
}
