using System.ComponentModel.DataAnnotations;

namespace AtrevidoFitness.API.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Username { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}