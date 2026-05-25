namespace AtrevidoFitness.API.DTOs
{
    // Uba?en u response dto da admin vidi ko je prijavljen
    public class SessionRegistrationDto
    {
        public int UserId { get; set; }
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
        public string? UserProfileImage { get; set; }
        public DateOnly SessionDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

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
        public List<SessionRegistrationDto> Registrations { get; set; } = new();
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