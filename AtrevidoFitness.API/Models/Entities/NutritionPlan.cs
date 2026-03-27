// Models/Entities/NutritionPlan.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class NutritionPlan
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        // "Guidelines" (za grupne) ili "FullPlan" (za individualne)
        public string PlanType { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Opcionalno: nutrition plan vezan za konkretnu clanicuu
        public int? AssignedToUserId { get; set; }
        public User? AssignedToUser { get; set; }

        public ICollection<NutritionRecipe> Recipes { get; set; } = new List<NutritionRecipe>();
    }
}