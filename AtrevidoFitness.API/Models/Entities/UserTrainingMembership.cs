// Models/Entities/UserTrainingMembership.cs
// Ovo prati kakav tip treninga clanica ima i da li je platila
namespace AtrevidoFitness.API.Models.Entities
{
    public class UserTrainingMembership
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // "Group" ili "Individual"
        public string TrainingType { get; set; } = string.Empty;

        // "Pending", "Active", "Inactive"
        public string Status { get; set; } = "Pending";

        // Samo za Individual: da li ima nutrition plan
        public bool NutritionEnabled { get; set; } = false;

        // "Pending", "Paid"
        public string PaymentStatus { get; set; } = "Pending";

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }


        public DateTime? ActivatedAt { get; set; }

        public string? AdminNotes { get; set; }
    }
}