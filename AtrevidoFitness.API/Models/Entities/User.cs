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

        [Required, MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        // Role: "Guest", "Member", "Admin"
        public string Role { get; set; } = "Member";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public UserTrainingMembership? TrainingMembership { get; set; }
        public ICollection<TrainingRegistration> TrainingRegistrations { get; set; } = new List<TrainingRegistration>();
        public ICollection<ChallengeParticipant> ChallengeParticipations { get; set; } = new List<ChallengeParticipant>();
        public ICollection<ProgressEntry> ProgressEntries { get; set; } = new List<ProgressEntry>();


    }
}