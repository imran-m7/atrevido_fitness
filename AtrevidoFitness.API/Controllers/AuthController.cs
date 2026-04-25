using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Helpers;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace AtrevidoFitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthController(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        private static bool IsValidPassword(string password, out string error)
        {
            error = string.Empty;
            if (password.Length < 6)
            {
                error = "Šifra mora imati najmanje 6 karaktera.";
                return false;
            }
            if (!password.Any(char.IsUpper))
            {
                error = "Šifra mora sadržati najmanje jedno veliko slovo.";
                return false;
            }
            if (!Regex.IsMatch(password, @"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]"))
            {
                error = "Šifra mora sadržati najmanje jedan specijalni znak (!@#$%^&* itd.).";
                return false;
            }
            return true;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserCreateDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username.ToLower()))
                return BadRequest(new { message = "Korisničko ime već postoji." });

            if (!IsValidPassword(dto.Password, out var passwordError))
                return BadRequest(new { message = passwordError });

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Username = dto.Username.ToLower(),
                Email = dto.Email?.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                PhoneNumber = dto.PhoneNumber,
                Role = "Member",
                IsActive = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtHelper.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Id = user.Id,
                Token = token,
                Username = user.Username,
                FirstName = user.FirstName,
                Role = user.Role,
                IsActive = user.IsActive
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username.ToLower());

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized(new { message = "Pogrešno korisničko ime ili šifra." });

            var token = _jwtHelper.GenerateToken(user);

            return Ok(new AuthResponseDto
            {
                Id = user.Id,
                Token = token,
                Username = user.Username,
                FirstName = user.FirstName,
                Role = user.Role,
                IsActive = user.IsActive
            });
        }
    }
}