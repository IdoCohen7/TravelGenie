namespace Server.BL
{
    public class Trip
    {
        public int Id { get; set; }
        public int UserId { get; set; }        // fk to user
        public string Destination { get; set; }
        public string GroupType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Pax { get; set; }
        public string? BudgetTier { get; set; }
        public DateTime CreatedAt { get; set; }

        public Trip() { }

        public Trip(int id, int userId, string destination, string groupType,
                    DateTime startDate, DateTime endDate, int pax,
                    string? budgetTier, DateTime createdAt)
        {
            Id = id;
            UserId = userId;
            Destination = destination;
            GroupType = groupType;
            StartDate = startDate;
            EndDate = endDate;
            Pax = pax;
            BudgetTier = budgetTier;
            CreatedAt = createdAt;
        }
    }
}
