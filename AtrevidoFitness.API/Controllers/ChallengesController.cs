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
    public class ChallengesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChallengesController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/challenges — javno
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var challenges = await _context.Challenges
                .Where(c => c.IsPublic)
                .Select(c => new ChallengeResponseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Rules = c.Rules,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    IsPublic = c.IsPublic,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();

            return Ok(challenges);
        }

        // GET api/challenges/{id} — javno
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var challenge = await _context.Challenges
                .FirstOrDefaultAsync(c => c.Id == id && c.IsPublic);

            if (challenge == null) return NotFound();

            return Ok(new ChallengeResponseDto
            {
                Id = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Rules = challenge.Rules,
                StartDate = challenge.StartDate,
                EndDate = challenge.EndDate,
                Status = challenge.Status,
                IsPublic = challenge.IsPublic,
                CreatedAt = challenge.CreatedAt
            });
        }

        // POST api/challenges — samo Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ChallengeCreateDto dto)
        {
            var challenge = new Challenge
            {
                Title = dto.Title,
                Description = dto.Description,
                Rules = dto.Rules,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = dto.Status,
                IsPublic = dto.IsPublic
            };

            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = challenge.Id }, challenge);
        }

        // PUT api/challenges/{id} — samo Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromBody] ChallengeUpdateDto dto)
        {
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null) return NotFound();

            if (dto.Title != null) challenge.Title = dto.Title;
            if (dto.Description != null) challenge.Description = dto.Description;
            if (dto.Rules != null) challenge.Rules = dto.Rules;
            if (dto.StartDate.HasValue) challenge.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) challenge.EndDate = dto.EndDate.Value;
            if (dto.Status != null) challenge.Status = dto.Status;
            if (dto.IsPublic.HasValue) challenge.IsPublic = dto.IsPublic.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Challenge updated." });
        }

        // POST api/challenges/{id}/join — samo Member
        [HttpPost("{id}/join")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> Join(int id)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null || challenge.Status != "Active")
                return BadRequest(new { message = "Challenge not available." });

            var alreadyJoined = await _context.ChallengeParticipants
                .AnyAsync(cp => cp.UserId == userId && cp.ChallengeId == id);

            if (alreadyJoined)
                return BadRequest(
                    new { message = "Already joined this challenge." });

            _context.ChallengeParticipants.Add(new ChallengeParticipant
            {
                UserId = userId,
                ChallengeId = id,
                Status = "Active"
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Joined challenge successfully." });
        }

        // GET api/challenges/{id}/participants — Admin
        [HttpGet("{id}/participants")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetParticipants(int id)
        {
            var participants = await _context.ChallengeParticipants
                .Where(cp => cp.ChallengeId == id)
                .Select(cp => new ChallengeParticipantResponseDto
                {
                    Id = cp.Id,
                    UserId = cp.UserId,
                    ChallengeId = cp.ChallengeId,
                    JoinedAt = cp.JoinedAt,
                    Status = cp.Status
                })
                .ToListAsync();

            return Ok(participants);
        }
    }
}