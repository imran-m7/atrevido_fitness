namespace AtrevidoFitness.API.DTOs
{
    public class TrainingSessionResponseDto
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string DayOfWeek { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int MaxCapacity { get; set; }
        public int MinCapacity { get; set; }
        public bool IsActive { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
    }

    public class TrainingSessionCreateDto
    {
        public string Type { get; set; } = string.Empty;
        public string DayOfWeek { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public int MaxCapacity { get; set; }
        public int MinCapacity { get; set; }
        public bool IsActive { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
    }

    public class TrainingSessionUpdateDto
    {
        public string? Type { get; set; }
        public string? DayOfWeek { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string? GroupName { get; set; }
        public int? MaxCapacity { get; set; }
        public int? MinCapacity { get; set; }
        public bool? IsActive { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
    }
}