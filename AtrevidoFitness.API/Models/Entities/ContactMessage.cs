// Models/Entities/ContactMessage.cs
// Poruke sa kontakt forme, vidljive i za goste
using System.ComponentModel.DataAnnotations;

namespace AtrevidoFitness.API.Models.Entities
{
    public class ContactMessage
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        // "New", "Read", "Replied"
        public string Status { get; set; } = "New";

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}