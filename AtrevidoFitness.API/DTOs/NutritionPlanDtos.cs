namespace AtrevidoFitness.API.DTOs
{
    public class NutritionPlanResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class NutritionPlanCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class NutritionPlanUpdateDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? PlanType { get; set; }
        public bool? IsActive { get; set; }
        public int? AssignedToUserId { get; set; }
    }
}