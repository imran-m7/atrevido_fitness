// Models/Entities/Challenge.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class Challenge
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Rules { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Status { get; set; } = "Upcoming";

        public bool IsPublic { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<ChallengeParticipant> Participants { get; set; } = new List<ChallengeParticipant>();
    }
}