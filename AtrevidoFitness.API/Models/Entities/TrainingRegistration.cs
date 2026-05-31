namespace AtrevidoFitness.API.Models.Entities
{
    public class TrainingRegistration
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int TrainingSessionId { get; set; }
        public TrainingSession TrainingSession { get; set; } = null!;

        public DateOnly SessionDate { get; set; }

        public string Status { get; set; } = "Registered";

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;
    }
}