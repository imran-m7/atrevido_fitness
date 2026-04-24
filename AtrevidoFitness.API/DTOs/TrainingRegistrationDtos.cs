namespace AtrevidoFitness.API.DTOs
{
    public class TrainingRegistrationResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int TrainingSessionId { get; set; }
        public DateOnly SessionDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RegisteredAt { get; set; }
        public string? UserFirstName { get; set; }
        public string? UserLastName { get; set; }
    }

    public class TrainingRegistrationCreateDto
    {
        public int TrainingSessionId { get; set; }
        public DateOnly SessionDate { get; set; }
    }

    public class TrainingRegistrationUpdateDto
    {
        public DateOnly? SessionDate { get; set; }
        public string? Status { get; set; }
    }
}