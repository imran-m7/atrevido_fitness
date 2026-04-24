namespace AtrevidoFitness.API.Models.Entities
{
    public class TrainingSession
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty;

        // 🔥 OVO MORA POSTOJATI
        public string DayOfWeek { get; set; } = string.Empty;

        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public string GroupName { get; set; } = string.Empty;

        public int MaxCapacity { get; set; } = 12;
        public int MinCapacity { get; set; } = 2;

        public bool IsActive { get; set; } = true;

        public string? Location { get; set; }
        public string? Notes { get; set; }

        public ICollection<TrainingRegistration> Registrations { get; set; }
            = new List<TrainingRegistration>();
    }
}