namespace Server.BL
{
    public class ItineraryItem
    {
        public int Id { get; set; }
        public int DayId { get; set; }         // fk to itineraryDay
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string Title { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public decimal? EstCost { get; set; }

        public ItineraryItem() { }

        public ItineraryItem(int id, int dayId, TimeSpan? startTime,
                             TimeSpan? endTime, string title, string? location,
                             string? notes, decimal? estCost)
        {
            Id = id;
            DayId = dayId;
            StartTime = startTime;
            EndTime = endTime;
            Title = title;
            Location = location;
            Notes = notes;
            EstCost = estCost;
        }
    }
}
