// Models/Entities/NutritionPlan.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class NutritionPlan
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // PDF polja
        public string? PdfFileName { get; set; }      // npr. "marija_plan.pdf"
        public string? PdfBase64 { get; set; }         // Base64 sadržaj PDF-a
        public string? PdfFileSize { get; set; }       // npr. "2.4 MB"
        public DateTime? PdfUploadedAt { get; set; }   // kad je uploadovan

        // Opciono: plan vezan za konkretnu članicu
        public int? AssignedToUserId { get; set; }
        public User? AssignedToUser { get; set; }
    }
}