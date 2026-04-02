namespace AtrevidoFitness.API.DTOs
{
    public class NutritionRecipeResponseDto
    {
        public int Id { get; set; }
        public int NutritionPlanId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Ingredients { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int? CaloriesPerServing { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class NutritionRecipeCreateDto
    {
        public int NutritionPlanId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Ingredients { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public int? CaloriesPerServing { get; set; }
    }

    public class NutritionRecipeUpdateDto
    {
        public string? Title { get; set; }
        public string? Ingredients { get; set; }
        public string? Instructions { get; set; }
        public string? ImageUrl { get; set; }
        public int? CaloriesPerServing { get; set; }
    }
}