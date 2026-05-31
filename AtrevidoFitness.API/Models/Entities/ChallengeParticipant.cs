// Models/Entities/ChallengeParticipant.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class ChallengeParticipant
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; } = null!;

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // "Active", "Completed", "Dropped"
        public string Status { get; set; } = "Active";
    }
}