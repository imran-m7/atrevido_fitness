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

        // GET api/trainingregistrations/mine — clanica vidi svoje prijave
        [HttpGet("mine")]
        public async Task<IActionResult> GetMine()
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var registrations = await _context.TrainingRegistrations
                .Where(r => r.UserId == userId)
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

        // POST api/trainingregistrations — clanica se prijavljuje
        [HttpPost]
        [Authorize(Roles = "Member,Admin")]
        public async Task<IActionResult> Register(
            [FromBody] TrainingRegistrationCreateDto dto)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // Provjeri aktivno clanstvo
            var membership = await _context.UserTrainingMemberships
                .FirstOrDefaultAsync(m => m.UserId == userId
                    && m.Status == "Active");

            if (membership == null)
                return Forbid();

            // Provjeri kapacitet
            var session = await _context.TrainingSessions
                .Include(s => s.Registrations)
                .FirstOrDefaultAsync(s => s.Id == dto.TrainingSessionId);

            if (session == null) return NotFound();

            var activeCount = session.Registrations
                .Count(r => r.SessionDate == dto.SessionDate
                    && r.Status == "Registered");

            if (activeCount >= session.MaxCapacity)
                return BadRequest(new { message = "Session is full." });

            // Provjeri duplikat za taj dan
            var alreadyRegistered = await _context.TrainingRegistrations
                .AnyAsync(r => r.UserId == userId
                    && r.SessionDate == dto.SessionDate
                    && r.Status == "Registered");

            if (alreadyRegistered)
                return BadRequest(
                    new { message = "Already registered for a session today." });

            var registration = new TrainingRegistration
            {
                UserId = userId, // iz tokena, ne iz DTO
                TrainingSessionId = dto.TrainingSessionId,
                SessionDate = dto.SessionDate,
                Status = "Registered" // uvijek Registered na pocetku
            };

            _context.TrainingRegistrations.Add(registration);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Successfully registered." });
        }

        // PUT api/trainingregistrations/{id} — update statusa
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromBody] TrainingRegistrationUpdateDto dto)
        {
            var registration = await _context.TrainingRegistrations.FindAsync(id);
            if (registration == null) return NotFound();

            if (dto.SessionDate.HasValue)
                registration.SessionDate = dto.SessionDate.Value;
            if (dto.Status != null)
                registration.Status = dto.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration updated." });
        }

        // DELETE api/trainingregistrations/{id} — clanica otkazuje
        [HttpDelete("{id}")]
        public async Task<IActionResult> Cancel(int id)
        {
            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var registration = await _context.TrainingRegistrations
                .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

            if (registration == null) return NotFound();

            registration.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration cancelled." });
        }

        // GET api/trainingregistrations/session/{sessionId} — Admin vidi ko je prijavljen
        [HttpGet("session/{sessionId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetBySession(int sessionId)
        {
            var registrations = await _context.TrainingRegistrations
                .Where(r => r.TrainingSessionId == sessionId
                    && r.Status == "Registered")
                .Include(r => r.User)
                .Select(r => new TrainingRegistrationResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    TrainingSessionId = r.TrainingSessionId,
                    SessionDate = r.SessionDate,
                    Status = r.Status,
                    RegisteredAt = r.RegisteredAt
                })
                .ToListAsync();

            return Ok(registrations);
        }
    }
}