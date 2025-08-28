namespace Server.BL
{
    public class Itinerary
    {
        public int Id { get; set; }
        public int TripId { get; set; }        // fk to trip
        public string Model { get; set; }
        public string PromptHash { get; set; }
        public string? Currency { get; set; }
        public decimal? TotalEstCost { get; set; }
        public string RawJson { get; set; }
        public DateTime CreatedAt { get; set; }

        public Itinerary() { }

        public Itinerary(int id, int tripId, string model, string promptHash,
                         string? currency, decimal? totalEstCost, string rawJson,
                         DateTime createdAt)
        {
            Id = id;
            TripId = tripId;
            Model = model;
            PromptHash = promptHash;
            Currency = currency;
            TotalEstCost = totalEstCost;
            RawJson = rawJson;
            CreatedAt = createdAt;
        }
    }
}
