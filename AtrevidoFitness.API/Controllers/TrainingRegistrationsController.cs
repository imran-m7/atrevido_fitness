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
    public class TrainingRegistrationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingRegistrationsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/trainingregistrations/mine
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var registrations = await _context.TrainingRegistrations
                .Where(r => r.UserId == userId && r.Status == "Registered")
                .OrderByDescending(r => r.SessionDate)
                .Select(r => new TrainingRegistrationResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    TrainingSessionId = r.TrainingSessionId,
                    SessionDate = r.SessionDate,
                    Status = r.Status,
                    RegisteredAt = r.RegisteredAt,
                    UserFirstName = r.User.FirstName,
                    UserLastName = r.User.LastName
                })
                .ToListAsync();

            return Ok(registrations);
        }

        // POST api/trainingregistrations
        [HttpPost]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> Register([FromBody] TrainingRegistrationCreateDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Provjeri aktivno clanstvo
            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId && m.Status == "Active");

            if (membership == null)
                return Forbid();

            // Provjeri da sesija postoji
            var session = await _context.TrainingSessions
                .Include(s => s.Registrations)
                .FirstOrDefaultAsync(s => s.Id == dto.TrainingSessionId);

            if (session == null) return NotFound();

            // Provjeri kapacitet (samo aktivne rezervacije)
            var activeCount = session.Registrations
                .Count(r => r.SessionDate == dto.SessionDate && r.Status == "Registered");

            if (activeCount >= session.MaxCapacity)
                return BadRequest(new { message = "Session is full." });

            // Provjeri da li postoji BILO KAKVA registracija (uključujući Cancelled)
            var existing = await _context.TrainingRegistrations
                .FirstOrDefaultAsync(r =>
                    r.UserId == userId &&
                    r.TrainingSessionId == dto.TrainingSessionId &&
                    r.SessionDate == dto.SessionDate);

            if (existing != null)
            {
                if (existing.Status == "Registered")
                    return BadRequest(new { message = "Already registered for this session." });

                // Ako je Cancelled — samo vrati na Registered umjesto novog INSERT-a
                existing.Status = "Registered";
                existing.RegisteredAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Successfully registered." });
            }

            // Novi red — prvi put se registruje
            var registration = new TrainingRegistration
            {
                UserId = userId,
                TrainingSessionId = dto.TrainingSessionId,
                SessionDate = dto.SessionDate,
                Status = "Registered"
            };

            _context.TrainingRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully registered." });
        }

        // DELETE api/trainingregistrations/{id} — otkazivanje
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var registration = await _context.TrainingRegistrations
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (registration == null) return NotFound();

            registration.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration cancelled." });
        }

        // PUT api/trainingregistrations/{id} — Admin update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] TrainingRegistrationUpdateDto dto)
        {
            var registration = await _context.TrainingRegistrations.FindAsync(id);
            if (registration == null) return NotFound();

            if (dto.SessionDate.HasValue) registration.SessionDate = dto.SessionDate.Value;
            if (dto.Status != null) registration.Status = dto.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration updated." });
        }

        // GET api/trainingregistrations/session/{sessionId} — Admin vidi ko je prijavljen
        [HttpGet("session/{sessionId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBySession(int sessionId)
        {
            var registrations = await _context.TrainingRegistrations
                .Where(r => r.TrainingSessionId == sessionId && r.Status == "Registered")
                .Include(r => r.User)
                .Select(r => new TrainingRegistrationResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    TrainingSessionId = r.TrainingSessionId,
                    SessionDate = r.SessionDate,
                    Status = r.Status,
                    RegisteredAt = r.RegisteredAt,
                    UserFirstName = r.User.FirstName,
                    UserLastName = r.User.LastName
                })
                .ToListAsync();

            return Ok(registrations);
        }
    }
}