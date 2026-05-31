namespace AtrevidoFitness.API.DTOs
{
    public class NutritionPlanResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? AssignedToUserId { get; set; }

        // PDF info (bez Base64 — ne šaljemo cijeli PDF u listi)
        public string? PdfFileName { get; set; }
        public string? PdfFileSize { get; set; }
        public DateTime? PdfUploadedAt { get; set; }
        public bool HasPdf => !string.IsNullOrEmpty(PdfFileName);
    }

    // Za download — vra?a Base64
    public class NutritionPlanPdfDto
    {
        public string PdfFileName { get; set; } = string.Empty;
        public string PdfBase64 { get; set; } = string.Empty;
    }

    public class NutritionPlanCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string PlanType { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class NutritionPlanUpdateDto
    {
        public string? Title { get; set; }
        public string? PlanType { get; set; }
        public bool? IsActive { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    // Za upload PDF-a
    public class NutritionPlanPdfUploadDto
    {
        public string PdfFileName { get; set; } = string.Empty;  // naziv fajla
        public string PdfBase64 { get; set; } = string.Empty;    // Base64 sadržaj
        public string PdfFileSize { get; set; } = string.Empty;  // npr. "2.4 MB"
    }
}