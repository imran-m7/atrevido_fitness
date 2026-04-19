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
    public class ProgressController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProgressController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/progress/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var entries = await _context.ProgressEntries
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.EntryDate)
                .Select(p => new ProgressEntryResponseDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    EntryDate = p.EntryDate,
                    WeightKg = p.WeightKg,
                    WaistCm = p.WaistCm,
                    HipsCm = p.HipsCm,
                    ChestCm = p.ChestCm,
                    ArmCm = p.ArmCm,
                    ThighCm = p.ThighCm,
                    Notes = p.Notes,
                    ChallengeId = p.ChallengeId,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(entries);
        }

        // POST api/progress
        [HttpPost]
        public async Task<IActionResult> Add(
            [FromBody] ProgressEntryCreateDto dto)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var entry = new ProgressEntry
            {
                UserId = userId, // iz tokena, ne iz DTO
                EntryDate = dto.EntryDate,
                WeightKg = dto.WeightKg,
                WaistCm = dto.WaistCm,
                HipsCm = dto.HipsCm,
                ChestCm = dto.ChestCm,
                ArmCm = dto.ArmCm,
                ThighCm = dto.ThighCm,
                Notes = dto.Notes,
                ChallengeId = dto.ChallengeId
            };

            _context.ProgressEntries.Add(entry);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Progress saved.", id = entry.Id });
        }

        // PUT api/progress/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,
            [FromBody] ProgressEntryUpdateDto dto)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var entry = await _context.ProgressEntries
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (entry == null) return NotFound();

            if (dto.EntryDate.HasValue) entry.EntryDate = dto.EntryDate.Value;
            if (dto.WeightKg.HasValue) entry.WeightKg = dto.WeightKg;
            if (dto.WaistCm.HasValue) entry.WaistCm = dto.WaistCm;
            if (dto.HipsCm.HasValue) entry.HipsCm = dto.HipsCm;
            if (dto.ChestCm.HasValue) entry.ChestCm = dto.ChestCm;
            if (dto.ArmCm.HasValue) entry.ArmCm = dto.ArmCm;
            if (dto.ThighCm.HasValue) entry.ThighCm = dto.ThighCm;
            if (dto.Notes != null) entry.Notes = dto.Notes;
            if (dto.ChallengeId.HasValue) entry.ChallengeId = dto.ChallengeId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Progress updated." });
        }

        // GET api/progress/user/{userId} — samo Admin
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var entries = await _context.ProgressEntries
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.EntryDate)
                .Select(p => new ProgressEntryResponseDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    EntryDate = p.EntryDate,
                    WeightKg = p.WeightKg,
                    WaistCm = p.WaistCm,
                    HipsCm = p.HipsCm,
                    ChestCm = p.ChestCm,
                    ArmCm = p.ArmCm,
                    ThighCm = p.ThighCm,
                    Notes = p.Notes,
                    ChallengeId = p.ChallengeId,
                    CreatedAt = p.CreatedAt
                })
                .ToListAsync();

            return Ok(entries);
        }
    }
}