// Models/Entities/NutritionRecipe.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class NutritionRecipe
    {
        public int Id { get; set; }

        public int NutritionPlanId { get; set; }
        public NutritionPlan NutritionPlan { get; set; } = null!;

        public string Title { get; set; } = string.Empty;

        public string Ingredients { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public int? CaloriesPerServing { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}