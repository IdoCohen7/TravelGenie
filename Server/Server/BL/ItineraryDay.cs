namespace Server.BL
{
    public class ItineraryDay
    {
        public int Id { get; set; }
        public int ItineraryId { get; set; }   // fk to itinerary
        public int DayIndex { get; set; }
        public string? Summary { get; set; }

        public ItineraryDay() { }

        public ItineraryDay(int id, int itineraryId, int dayIndex, string? summary)
        {
            Id = id;
            ItineraryId = itineraryId;
            DayIndex = dayIndex;
            Summary = summary;
        }
    }
}
