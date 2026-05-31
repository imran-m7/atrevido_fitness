using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AtrevidoFitness.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MembershipController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MembershipController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/membership/request
        [HttpPost("request")]
        public async Task<IActionResult> RequestMembership(
            [FromBody] UserTrainingMembershipCreateDto dto)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var existing = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (existing != null)
                return BadRequest(new { message = "Membership request already exists." });

            var trainingType = dto.TrainingType switch
            {
                "group" => "Group",
                "individual" => "Individual",
                "individual-nutrition" => "Individual",
                _ => "Group"
            };

            var nutritionEnabled = dto.TrainingType == "individual-nutrition";

            var membership = new UserTrainingMembership
            {
                UserId = userId,
                TrainingType = trainingType,
                Status = "Pending",
                PaymentStatus = "Pending",
                NutritionEnabled = nutritionEnabled,
                RequestedAt = DateTime.UtcNow
            };

            _context.UserTrainingMemberships.Add(membership);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Membership request sent." });
        }

        // GET api/membership/mine — clanica vidi svoj membership
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId);

            if (membership == null)
                return Ok(null);

            return Ok(new
            {
                membership.TrainingType,
                membership.Status,
                membership.PaymentStatus,
                membership.NutritionEnabled
            });
        }
    }
}