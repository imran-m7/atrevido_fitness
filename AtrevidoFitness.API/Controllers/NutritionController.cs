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
    public class NutritionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NutritionController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/nutrition/members — Admin vidi sve članice sa Individual+Ishrana
        [HttpGet("members")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMembers()
        {
            var members = await _context.Users
                .Where(u => u.Role == "Member")
                .Include(u => u.TrainingMembership)
                .Where(u => u.TrainingMembership != null
                    && u.TrainingMembership.NutritionEnabled
                    && u.TrainingMembership.Status == "Active")
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Username,
                    u.ProfileImageBase64,
                    NutritionPlan = _context.NutritionPlans
                        .Where(n => n.AssignedToUserId == u.Id && n.IsActive)
                        .Select(n => new NutritionPlanResponseDto
                        {
                            Id = n.Id,
                            Title = n.Title,
                            PdfFileName = n.PdfFileName,
                            PdfFileSize = n.PdfFileSize,
                            PdfUploadedAt = n.PdfUploadedAt,
                            AssignedToUserId = n.AssignedToUserId
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(members);
        }

        // GET api/nutrition/mine — Clanica vidi info o svom planu (bez PDF-a)
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId && m.Status == "Active");

            if (membership == null || !membership.NutritionEnabled)
                return Forbid();

            var plan = await _context.NutritionPlans
                .Where(n => n.AssignedToUserId == userId && n.IsActive)
                .Select(n => new NutritionPlanResponseDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    PdfFileName = n.PdfFileName,
                    PdfFileSize = n.PdfFileSize,
                    PdfUploadedAt = n.PdfUploadedAt,
                    AssignedToUserId = n.AssignedToUserId
                })
                .FirstOrDefaultAsync();

            return Ok(plan); // null ako nema plan još
        }

        // GET api/nutrition/{id}/download — Clanica preuzima PDF
        [HttpGet("{id}/download")]
        public async Task<IActionResult> Download(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var plan = await _context.NutritionPlans
                .FirstOrDefaultAsync(n => n.Id == id
                    && n.AssignedToUserId == userId
                    && n.IsActive);

            if (plan == null) return NotFound();
            if (string.IsNullOrEmpty(plan.PdfBase64))
                return NotFound(new { message = "PDF nije uploadovan." });

            return Ok(new NutritionPlanPdfDto
            {
                PdfFileName = plan.PdfFileName!,
                PdfBase64 = plan.PdfBase64
            });
        }

        // POST api/nutrition/{userId}/upload — Admin uploaduje PDF za članicu
        [HttpPost("{userId}/upload")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadPdf(int userId,
            [FromBody] NutritionPlanPdfUploadDto dto)
        {
            // Provjeri da li clanica ima nutrition enabled
            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId
                    && m.NutritionEnabled
                    && m.Status == "Active");

            if (membership == null)
                return BadRequest(new { message = "Clanica nema aktivan Individual+Ishrana plan." });

            // Provjeri da li već postoji plan za tu članicu
            var existing = await _context.NutritionPlans
                .FirstOrDefaultAsync(n => n.AssignedToUserId == userId && n.IsActive);

            if (existing != null)
            {
                // Ažuriraj postojeći
                existing.PdfFileName = dto.PdfFileName;
                existing.PdfBase64 = dto.PdfBase64;
                existing.PdfFileSize = dto.PdfFileSize;
                existing.PdfUploadedAt = DateTime.UtcNow;
            }
            else
            {
                // Kreiraj novi
                var plan = new NutritionPlan
                {
                    Title = $"Plan ishrane",
                    PlanType = "FullPlan",
                    IsActive = true,
                    AssignedToUserId = userId,
                    PdfFileName = dto.PdfFileName,
                    PdfBase64 = dto.PdfBase64,
                    PdfFileSize = dto.PdfFileSize,
                    PdfUploadedAt = DateTime.UtcNow
                };
                _context.NutritionPlans.Add(plan);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "PDF uspješno uploadovan." });
        }

        // DELETE api/nutrition/{userId}/pdf — Admin briše plan ishrane iz baze
        [HttpDelete("{userId}/pdf")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePdf(int userId)
        {
            var plan = await _context.NutritionPlans
                .FirstOrDefaultAsync(n => n.AssignedToUserId == userId && n.IsActive);

            if (plan == null) return NotFound();

            // Hard delete — briše cijeli red iz baze
            _context.NutritionPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Plan ishrane obrisan iz baze." });
        }
    }
}