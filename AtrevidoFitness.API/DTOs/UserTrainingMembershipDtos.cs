namespace AtrevidoFitness.API.DTOs
{
    public class UserTrainingMembershipResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string TrainingType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool NutritionEnabled { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
        public DateTime? ActivatedAt { get; set; }
        public string? AdminNotes { get; set; }
    }

    public class UserTrainingMembershipCreateDto
    {
        public int UserId { get; set; }
        public string TrainingType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool NutritionEnabled { get; set; }
        public string PaymentStatus { get; set; } = string.Empty;
        public DateTime? ActivatedAt { get; set; }
        public string? AdminNotes { get; set; }
    }

    public class UserTrainingMembershipUpdateDto
    {
        public string? TrainingType { get; set; }
        public string? Status { get; set; }
        public bool? NutritionEnabled { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? ActivatedAt { get; set; }
        public string? AdminNotes { get; set; }
    }
}