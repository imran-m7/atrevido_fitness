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

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        private static ProgressEntryResponseDto MapProgressEntryResponse(ProgressEntry entry)
        {
            return new ProgressEntryResponseDto
            {
                Id = entry.Id,
                UserId = entry.UserId,
                EntryDate = entry.EntryDate,
                WeightKg = entry.WeightKg,
                WaistCm = entry.WaistCm,
                HipsCm = entry.HipsCm,
                ChestCm = entry.ChestCm,
                ArmCm = entry.ArmCm,
                ThighCm = entry.ThighCm,
                Notes = entry.Notes,
                ChallengeId = entry.ChallengeId,
                CreatedAt = entry.CreatedAt
            };
        }

        private async Task<bool> ChallengeExistsAsync(int? challengeId)
        {
            return !challengeId.HasValue
                || await _context.Challenges.AnyAsync(c => c.Id == challengeId.Value);
        }

        // GET api/progress/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = GetCurrentUserId();

            var entries = await _context.ProgressEntries
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.EntryDate)
                .Select(p => MapProgressEntryResponse(p))
                .ToListAsync();

            return Ok(entries);
        }

        // POST api/progress
        [HttpPost]
        public async Task<IActionResult> Add(
            [FromBody] ProgressEntryCreateDto dto)
        {
            var userId = GetCurrentUserId();

            if (!await ChallengeExistsAsync(dto.ChallengeId))
                return BadRequest(new { message = "Challenge does not exist." });

            var entry = new ProgressEntry
            {
                UserId = userId,
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

            return Ok(MapProgressEntryResponse(entry));
        }

        // POST api/progress/user/{userId}
        [HttpPost("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddForUser(
            int userId,
            [FromBody] ProgressEntryCreateDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return NotFound(new { message = "User does not exist." });

            if (!await ChallengeExistsAsync(dto.ChallengeId))
                return BadRequest(new { message = "Challenge does not exist." });

            var entry = new ProgressEntry
            {
                UserId = userId,
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

            return Ok(MapProgressEntryResponse(entry));
        }

        // PUT api/progress/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id,
            [FromBody] ProgressEntryUpdateDto dto)
        {
            var userId = GetCurrentUserId();

            var entry = await _context.ProgressEntries
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

            if (entry == null) return NotFound();

            if (dto.ChallengeId.HasValue && !await ChallengeExistsAsync(dto.ChallengeId))
                return BadRequest(new { message = "Challenge does not exist." });

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
            return Ok(MapProgressEntryResponse(entry));
        }

        // PUT api/progress/user/{userId}/{entryId}
        [HttpPut("user/{userId}/{entryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateForUser(
            int userId,
            int entryId,
            [FromBody] ProgressEntryUpdateDto dto)
        {
            var entry = await _context.ProgressEntries
                .FirstOrDefaultAsync(p => p.Id == entryId && p.UserId == userId);

            if (entry == null)
                return NotFound();

            if (dto.ChallengeId.HasValue && !await ChallengeExistsAsync(dto.ChallengeId))
                return BadRequest(new { message = "Challenge does not exist." });

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
            return Ok(MapProgressEntryResponse(entry));
        }

        // GET api/progress/user/{userId} — samo Admin
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var entries = await _context.ProgressEntries
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.EntryDate)
                .Select(p => MapProgressEntryResponse(p))
                .ToListAsync();

            return Ok(entries);
        }
    }
}
