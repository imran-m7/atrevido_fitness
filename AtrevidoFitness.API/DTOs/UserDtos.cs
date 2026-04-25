using System.ComponentModel.DataAnnotations;

namespace AtrevidoFitness.API.DTOs
{
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class UserCreateDto
    {
        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Email { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }
    }

    public class UserUpdateDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? IsActive { get; set; }
    }

    public class UserStatusUpdateDto
    {
        public bool IsActive { get; set; }
    }
}