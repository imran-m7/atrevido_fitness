using System.ComponentModel.DataAnnotations;

namespace AtrevidoFitness.API.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        // Username umjesto Email za login
        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        // Email ostaje opcioni za kontakt
        [MaxLength(200)]
        public string? Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        // Role: "Guest", "Member", "Admin"
        public string Role { get; set; } = "Member";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? ProfileImageBase64 { get; set; }


        public bool IsActive { get; set; } = false;

        public UserTrainingMembership? TrainingMembership { get; set; }
        public ICollection<TrainingRegistration> TrainingRegistrations { get; set; } = new List<TrainingRegistration>();
        public ICollection<ChallengeParticipant> ChallengeParticipations { get; set; } = new List<ChallengeParticipant>();
        public ICollection<ProgressEntry> ProgressEntries { get; set; } = new List<ProgressEntry>();
    }
}