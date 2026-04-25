using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/admin/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var weekStart = today.AddDays(-(int)DateTime.Today.DayOfWeek);
            var weekEnd = weekStart.AddDays(7);
            var todayDayName = DateTime.Today.DayOfWeek.ToString();

            var totalMembers = await _context.Users
                .CountAsync(u => u.Role == "Member" && u.IsActive);

            var todaySessions = await _context.TrainingSessions
                .CountAsync(s => s.DayOfWeek == todayDayName && s.IsActive);

            var weekRegistrations = await _context.TrainingRegistrations
                .CountAsync(r => r.SessionDate >= weekStart
                    && r.SessionDate <= weekEnd
                    && r.Status == "Registered");

            var activeChallenge = await _context.Challenges
                .Where(c => c.Status == "Active")
                .Select(c => new { c.Title, Participants = c.Participants.Count })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                TotalMembers = totalMembers,
                TodaySessions = todaySessions,
                WeekRegistrations = weekRegistrations,
                ActiveChallenge = activeChallenge
            });
        }

        // GET api/admin/members
        [HttpGet("members")]
        public async Task<IActionResult> GetMembers()
        {
            var members = await _context.Users
                .Where(u => u.Role == "Member")
                .Include(u => u.TrainingMembership)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber,
                    u.Role,
                    u.IsActive,
                    u.CreatedAt,
                    Membership = u.TrainingMembership == null ? null : new
                    {
                        u.TrainingMembership.TrainingType,
                        u.TrainingMembership.Status,
                        u.TrainingMembership.PaymentStatus,
                        u.TrainingMembership.NutritionEnabled,
                        u.TrainingMembership.RequestedAt,
                        u.TrainingMembership.ActivatedAt,
                        u.TrainingMembership.AdminNotes
                    }
                })
                .ToListAsync();

            return Ok(members);
        }

        // PUT api/admin/members/{id}/membership
        [HttpPut("members/{id}/membership")]
        public async Task<IActionResult> UpdateMembership(int id, [FromBody] UserTrainingMembershipUpdateDto dto)
        {
            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == id);

            if (membership == null)
            {
                membership = new UserTrainingMembership
                {
                    UserId = id,
                    TrainingType = dto.TrainingType ?? "Group",
                    Status = dto.Status ?? "Pending",
                    PaymentStatus = dto.PaymentStatus ?? "Pending",
                    NutritionEnabled = dto.NutritionEnabled ?? false,
                    AdminNotes = dto.AdminNotes,
                    RequestedAt = DateTime.UtcNow
                };

                if (dto.Status == "Active")
                    membership.ActivatedAt = DateTime.UtcNow;

                _context.UserTrainingMemberships.Add(membership);
            }
            else
            {
                if (dto.TrainingType != null) membership.TrainingType = dto.TrainingType;
                if (dto.Status != null) membership.Status = dto.Status;
                if (dto.PaymentStatus != null) membership.PaymentStatus = dto.PaymentStatus;
                if (dto.NutritionEnabled.HasValue) membership.NutritionEnabled = dto.NutritionEnabled.Value;
                if (dto.AdminNotes != null) membership.AdminNotes = dto.AdminNotes;

                if (dto.Status == "Active" && membership.ActivatedAt == null)
                    membership.ActivatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Membership updated." });
        }

        // PUT api/admin/members/{id}/status — aktivacija/deaktivacija usera
        [HttpPut("members/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] UserStatusUpdateDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found." });

            user.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = dto.IsActive
                    ? $"Korisnik {user.FirstName} {user.LastName} je aktiviran."
                    : $"Korisnik {user.FirstName} {user.LastName} je deaktiviran."
            });
        }
    }
}