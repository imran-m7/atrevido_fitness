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

        private static ChallengeResponseDto MapChallengeResponse(
            Challenge challenge,
            ChallengeParticipant? participant = null)
        {
            return new ChallengeResponseDto
            {
                Id = challenge.Id,
                Title = challenge.Title,
                Description = challenge.Description,
                Rules = challenge.Rules,
                StartDate = challenge.StartDate,
                EndDate = challenge.EndDate,
                Status = challenge.Status,
                IsPublic = challenge.IsPublic,
                CreatedAt = challenge.CreatedAt,
                ParticipantCount = challenge.Participants.Count(p => p.Status == "Active"),
                JoinedAt = participant?.JoinedAt,
                ParticipationStatus = participant?.Status
            };
        }

        private static bool HasInvalidDateRange(DateTime startDate, DateTime endDate)
        {
            return endDate < startDate;
        }

        private static decimal CalculateLeaderboardScore(List<ProgressEntry> entries)
        {
            if (entries.Count < 2)
                return 0m;

            var earliest = entries[0];
            var latest = entries[^1];

            var weightLoss = (earliest.WeightKg ?? 0m) - (latest.WeightKg ?? 0m);
            var waistLoss = (earliest.WaistCm ?? 0m) - (latest.WaistCm ?? 0m);
            var armLoss = (earliest.ArmCm ?? 0m) - (latest.ArmCm ?? 0m);
            var thighLoss = (earliest.ThighCm ?? 0m) - (latest.ThighCm ?? 0m);

            return (weightLoss * 10m)
                 + (waistLoss * 3m)
                 + (armLoss * 2m)
                 + (thighLoss * 2m);
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        }

        // GET api/challenges
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var challenges = await _context.Challenges
                .Where(c => c.IsPublic)
                .Include(c => c.Participants)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(challenges.Select(c => MapChallengeResponse(c)));
        }

        // GET api/challenges/available
        [HttpGet("available")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> GetAvailable()
        {
            var userId = GetCurrentUserId();

            var joinedChallengeIds = await _context.ChallengeParticipants
                .Where(cp => cp.UserId == userId && cp.Status == "Active")
                .Select(cp => cp.ChallengeId)
                .ToListAsync();

            var challenges = await _context.Challenges
                .Where(c => c.IsPublic && !joinedChallengeIds.Contains(c.Id))
                .Include(c => c.Participants)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(challenges.Select(c => MapChallengeResponse(c)));
        }

        // GET api/challenges/admin/all
        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var challenges = await _context.Challenges
                .Include(c => c.Participants)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(challenges.Select(c => MapChallengeResponse(c)));
        }

        // GET api/challenges/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var challenge = await _context.Challenges
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsPublic);

            if (challenge == null)
                return NotFound();

            return Ok(MapChallengeResponse(challenge));
        }

        // POST api/challenges
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] ChallengeCreateDto dto)
        {
            if (HasInvalidDateRange(dto.StartDate, dto.EndDate))
                return BadRequest(new { message = "End date cannot be earlier than start date." });

            var challenge = new Challenge
            {
                Title = dto.Title,
                Description = dto.Description,
                Rules = dto.Rules,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Upcoming" : dto.Status,
                IsPublic = dto.IsPublic
            };

            _context.Challenges.Add(challenge);
            await _context.SaveChangesAsync();

            await _context.Entry(challenge)
                .Collection(c => c.Participants)
                .LoadAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = challenge.Id },
                MapChallengeResponse(challenge));
        }

        // PUT api/challenges/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ChallengeUpdateDto dto)
        {
            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null)
                return NotFound();

            var updatedStartDate = dto.StartDate ?? challenge.StartDate;
            var updatedEndDate = dto.EndDate ?? challenge.EndDate;

            if (HasInvalidDateRange(updatedStartDate, updatedEndDate))
                return BadRequest(new { message = "End date cannot be earlier than start date." });

            if (dto.Title != null) challenge.Title = dto.Title;
            if (dto.Description != null) challenge.Description = dto.Description;
            if (dto.Rules != null) challenge.Rules = dto.Rules;
            if (dto.StartDate.HasValue) challenge.StartDate = dto.StartDate.Value;
            if (dto.EndDate.HasValue) challenge.EndDate = dto.EndDate.Value;
            if (!string.IsNullOrWhiteSpace(dto.Status)) challenge.Status = dto.Status;
            if (dto.IsPublic.HasValue) challenge.IsPublic = dto.IsPublic.Value;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Challenge updated." });
        }

        // POST api/challenges/{id}/join
        [HttpPost("{id}/join")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> Join(int id)
        {
            var userId = GetCurrentUserId();

            var challenge = await _context.Challenges.FindAsync(id);
            if (challenge == null)
                return NotFound();

            var existingParticipant = await _context.ChallengeParticipants
                .FirstOrDefaultAsync(cp => cp.UserId == userId && cp.ChallengeId == id);

            if (existingParticipant != null)
            {
                if (string.Equals(existingParticipant.Status, "Dropped", StringComparison.OrdinalIgnoreCase))
                {
                    existingParticipant.Status = "Active";
                    existingParticipant.JoinedAt = DateTime.UtcNow;
                }
                else
                {
                    return BadRequest(new { message = "Already joined this challenge." });
                }
            }
            else
            {
                _context.ChallengeParticipants.Add(new ChallengeParticipant
                {
                    UserId = userId,
                    ChallengeId = id,
                    Status = "Active"
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Joined challenge successfully." });
        }

        // POST api/challenges/{id}/leave
        [HttpPost("{id}/leave")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> Leave(int id)
        {
            var userId = GetCurrentUserId();

            var participant = await _context.ChallengeParticipants
                .FirstOrDefaultAsync(cp => cp.UserId == userId && cp.ChallengeId == id);

            if (participant == null)
                return BadRequest(new { message = "You have not joined this challenge." });

            if (string.Equals(participant.Status, "Dropped", StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { message = "You have already left this challenge." });

            participant.Status = "Dropped";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Left challenge successfully." });
        }

        // GET api/challenges/{id}/participants
        [HttpGet("{id}/participants")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetParticipants(int id)
        {
            var challengeExists = await _context.Challenges.AnyAsync(c => c.Id == id);
            if (!challengeExists)
                return NotFound();

            var participants = await _context.ChallengeParticipants
                .Where(cp => cp.ChallengeId == id)
                .Select(cp => new ChallengeParticipantResponseDto
                {
                    Id = cp.Id,
                    UserId = cp.UserId,
                    ChallengeId = cp.ChallengeId,
                    JoinedAt = cp.JoinedAt,
                    Status = cp.Status,
                    UserFirstName = cp.User.FirstName,
                    UserLastName = cp.User.LastName
                })
                .ToListAsync();

            return Ok(participants);
        }

        // GET api/challenges/{id}/leaderboard
        [HttpGet("{id}/leaderboard")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> GetLeaderboard(int id)
        {
            var exists = await _context.Challenges.AnyAsync(c => c.Id == id);
            if (!exists)
                return NotFound();

            var participants = await _context.ChallengeParticipants
                .Where(cp => cp.ChallengeId == id && cp.Status == "Active")
                .Select(cp => new
                {
                    cp.UserId,
                    Name = cp.User.FirstName + " " + cp.User.LastName
                })
                .ToListAsync();

            var participantUserIds = participants
                .Select(p => p.UserId)
                .ToList();

            var progressEntries = await _context.ProgressEntries
                .Where(p => p.ChallengeId == id && participantUserIds.Contains(p.UserId))
                .OrderBy(p => p.EntryDate)
                .ToListAsync();

            var ranked = participants
                .Select(participant => new ChallengeLeaderboardDto
                {
                    UserId = participant.UserId,
                    Name = participant.Name,
                    Score = CalculateLeaderboardScore(
                        progressEntries
                            .Where(entry => entry.UserId == participant.UserId)
                            .OrderBy(entry => entry.EntryDate)
                            .ToList())
                })
                .OrderByDescending(x => x.Score)
                .Select((x, index) => new ChallengeLeaderboardDto
                {
                    UserId = x.UserId,
                    Name = x.Name,
                    Score = x.Score,
                    Rank = index + 1
                })
                .ToList();

            return Ok(ranked);
        }

        // GET api/challenges/my
        [HttpGet("my")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> GetMyChallenges()
        {
            var userId = GetCurrentUserId();

            var challenges = await _context.ChallengeParticipants
                .Where(cp => cp.UserId == userId)
                .Include(cp => cp.Challenge)
                .ThenInclude(c => c.Participants)
                .Select(cp => new ChallengeResponseDto
                {
                    Id = cp.Challenge.Id,
                    Title = cp.Challenge.Title,
                    Description = cp.Challenge.Description,
                    Rules = cp.Challenge.Rules,
                    StartDate = cp.Challenge.StartDate,
                    EndDate = cp.Challenge.EndDate,
                    Status = cp.Challenge.Status,
                    IsPublic = cp.Challenge.IsPublic,
                    CreatedAt = cp.Challenge.CreatedAt,
                    ParticipantCount = cp.Challenge.Participants.Count,
                    JoinedAt = cp.JoinedAt,
                    ParticipationStatus = cp.Status
                })
                .ToListAsync();

            return Ok(new
            {
                Active = challenges
                    .Where(c => string.Equals(c.ParticipationStatus, "Active", StringComparison.OrdinalIgnoreCase))
                    .ToList(),

                Completed = challenges
                    .Where(c => string.Equals(c.ParticipationStatus, "Completed", StringComparison.OrdinalIgnoreCase))
                    .ToList(),

                Dropped = challenges
                    .Where(c => string.Equals(c.ParticipationStatus, "Dropped", StringComparison.OrdinalIgnoreCase))
                    .ToList()
            });
        }

        // PUT api/challenges/{id}/participants/{userId}
        [HttpPut("{id}/participants/{userId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateParticipantStatus(
            int id,
            int userId,
            [FromBody] ChallengeParticipantUpdateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest(new { message = "Participant status is required." });

            var participant = await _context.ChallengeParticipants
                .FirstOrDefaultAsync(cp => cp.ChallengeId == id && cp.UserId == userId);

            if (participant == null)
                return NotFound();

            participant.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Participant status updated." });
        }

        // DELETE api/challenges/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var challenge = await _context.Challenges
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (challenge == null)
                return NotFound();

            _context.Challenges.Remove(challenge);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Challenge obrisan." });
        }
    }
}
