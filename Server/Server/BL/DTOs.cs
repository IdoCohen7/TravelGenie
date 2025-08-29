namespace Server.BL
{
    public class TripInputDto
    {
        public string Destination { get; set; } = default!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string GroupType { get; set; } = default!;
        public int Pax { get; set; }
        public string? BudgetTier { get; set; }
        public List<string>? Preferences { get; set; }
    }

    public class ItineraryDto
    {
        public string Currency { get; set; } = "USD";
        public decimal? TotalEstCost { get; set; }
        public List<ItineraryDayDto> Days { get; set; } = new();
    }

    public class ItineraryDayDto
    {
        public int DayIndex { get; set; }
        public string? Summary { get; set; }
        public List<ItineraryItemDto> Items { get; set; } = new();
    }

    public class ItineraryItemDto
    {
        public string? StartTime { get; set; }
        public string? EndTime { get; set; }
        public string Title { get; set; } = default!;
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public decimal? EstCost { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
