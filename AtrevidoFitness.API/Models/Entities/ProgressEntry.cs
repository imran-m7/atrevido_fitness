// Models/Entities/ProgressEntry.cs
// Clanica unosi svoju tezinu, mjerenja itd.
namespace AtrevidoFitness.API.Models.Entities
{
    public class ProgressEntry
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public DateOnly EntryDate { get; set; }
        
        // Tezina u kg
        public decimal? WeightKg { get; set; }

        // Mjerenja u cm
        public decimal? WaistCm { get; set; }
        public decimal? HipsCm { get; set; }
        public decimal? ChestCm { get; set; }
        public decimal? ArmCm { get; set; }
        public decimal? ThighCm { get; set; }

        public string? Notes { get; set; }

        // Opcionalno: vezan za challenge
        public int? ChallengeId { get; set; }
        public Challenge? Challenge { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}