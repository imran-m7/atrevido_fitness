// Models/Entities/TrainingSession.cs
// Fiksni termini treninga koje Dika kreira/edituje
namespace AtrevidoFitness.API.Models.Entities
{
    public class TrainingSession
    {
        public int Id { get; set; }

        // "Group" ili "Individual"
        public string Type { get; set; } = string.Empty;

        // "Monday", "Tuesday", itd.
        public string DayOfWeek { get; set; } = string.Empty;

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        // Npr. "Grupa 1", "Grupa 2"
        public string GroupName { get; set; } = string.Empty;

        public int MaxCapacity { get; set; } = 12;

        public int MinCapacity { get; set; } = 2;

        public bool IsActive { get; set; } = true;

        public string? Location { get; set; }

        public string? Notes { get; set; }

        // Navigation
        public ICollection<TrainingRegistration> Registrations { get; set; } = new List<TrainingRegistration>();
    }
}