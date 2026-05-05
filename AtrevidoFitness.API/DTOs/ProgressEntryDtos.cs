namespace AtrevidoFitness.API.DTOs
{
    public class ProgressEntryResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateOnly EntryDate { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public decimal? WaistCm { get; set; }
        public decimal? HipsCm { get; set; }
        public decimal? ChestCm { get; set; }
        public decimal? ArmCm { get; set; }
        public decimal? ThighCm { get; set; }
        public string? Notes { get; set; }
        public int? ChallengeId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ProgressEntryCreateDto
    {
        public DateOnly EntryDate { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public decimal? WaistCm { get; set; }
        public decimal? HipsCm { get; set; }
        public decimal? ChestCm { get; set; }
        public decimal? ArmCm { get; set; }
        public decimal? ThighCm { get; set; }
        public string? Notes { get; set; }
        public int? ChallengeId { get; set; }
    }

    public class ProgressEntryUpdateDto
    {
        public DateOnly? EntryDate { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? HeightCm { get; set; }
        public decimal? WaistCm { get; set; }
        public decimal? HipsCm { get; set; }
        public decimal? ChestCm { get; set; }
        public decimal? ArmCm { get; set; }
        public decimal? ThighCm { get; set; }
        public string? Notes { get; set; }
        public int? ChallengeId { get; set; }
    }
}