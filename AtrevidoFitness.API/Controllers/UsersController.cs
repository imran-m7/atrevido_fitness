using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AtrevidoFitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/users/profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users
                .Include(u => u.TrainingMembership)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return NotFound();

            return Ok(new UserProfileResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Username = user.Username,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                IsActive = user.IsActive,
                MembershipType = user.TrainingMembership?.TrainingType,
                MembershipStatus = user.TrainingMembership?.Status,
                NutritionEnabled = user.TrainingMembership?.NutritionEnabled ?? false,
            });
        }

        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UserProfileDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null) return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;

            if (!string.IsNullOrWhiteSpace(dto.Username))
            {
                var cleanUsername = dto.Username.ToLower().Trim();
                var usernameExists = await _context.Users
                    .AnyAsync(u => u.Username == cleanUsername && u.Id != userId);
                if (usernameExists)
                    return BadRequest(new { message = "Korisni?ko ime ve? postoji." });
                user.Username = cleanUsername;
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                if (dto.NewPassword.Length < 6)
                    return BadRequest(new { message = "Šifra mora imati najmanje 6 karaktera." });
                if (!dto.NewPassword.Any(char.IsUpper))
                    return BadRequest(new { message = "Šifra mora sadržati najmanje jedno veliko slovo." });
                if (!System.Text.RegularExpressions.Regex.IsMatch(dto.NewPassword,
                    @"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]"))
                    return BadRequest(new { message = "Šifra mora sadržati najmanje jedan specijalni znak." });

                // Direktni SQL update za password
                var hashed = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE Users SET PasswordHash = {0} WHERE Id = {1}",
                    hashed, userId);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profil uspješno ažuriran.", newUsername = user.Username });
        }

        // GET api/users/members
        [HttpGet("members")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMembers()
        {
            var members = await _context.Users
                .Where(u => u.Role == "Member")
                .OrderBy(u => u.FirstName)
                .ThenBy(u => u.LastName)
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Role = u.Role,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(members);
        }
    }
}
