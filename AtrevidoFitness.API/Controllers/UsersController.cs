using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
