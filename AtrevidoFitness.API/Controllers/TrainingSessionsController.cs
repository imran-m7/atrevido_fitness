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
    public class TrainingSessionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingSessionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/trainingsessions
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sessions = await _context.TrainingSessions
                .Where(s => s.IsActive)
                .Include(s => s.Registrations)
                    .ThenInclude(r => r.User)
                .ToListAsync();

            var result = sessions.Select(s => new TrainingSessionResponseDto
            {
                Id = s.Id,
                Type = s.Type,
                DayOfWeek = s.DayOfWeek,
                StartTime = s.StartTime,
                EndTime = s.EndTime,
                GroupName = s.GroupName,
                MaxCapacity = s.MaxCapacity,
                MinCapacity = s.MinCapacity,
                IsActive = s.IsActive,
                Location = s.Location,
                Notes = s.Notes,
                Registrations = s.Registrations
                    .Where(r => r.Status == "Registered")
                    .Select(r => new SessionRegistrationDto
                    {
                        UserId = r.UserId,
                        UserFirstName = r.User.FirstName,
                        UserLastName = r.User.LastName,
                        UserProfileImage = r.User.ProfileImageBase64,  

                        SessionDate = r.SessionDate,
                        Status = r.Status
                    })
                    .ToList()
            });

            return Ok(result);
        }

        // POST api/trainingsessions
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] TrainingSessionCreateDto dto)
        {
            var session = new TrainingSession
            {
                Type = dto.Type,
                DayOfWeek = dto.DayOfWeek,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                GroupName = dto.GroupName,
                MaxCapacity = dto.MaxCapacity,
                MinCapacity = dto.MinCapacity,
                IsActive = dto.IsActive,
                Location = dto.Location,
                Notes = dto.Notes
            };

            _context.TrainingSessions.Add(session);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = session.Id }, session);
        }

        // PUT api/trainingsessions/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] TrainingSessionUpdateDto dto)
        {
            var session = await _context.TrainingSessions
                .Include(s => s.Registrations)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            // Provjeri da li se mijenja dan, vrijeme ili tip treninga
            bool scheduleChanged =
                (dto.DayOfWeek != null && dto.DayOfWeek != session.DayOfWeek) ||
                (dto.StartTime.HasValue && dto.StartTime.Value != session.StartTime) ||
                (dto.EndTime.HasValue && dto.EndTime.Value != session.EndTime) ||
                (dto.Type != null && dto.Type != session.Type);

            // Primijeni sve izmjene na sesiju
            if (dto.Type != null) session.Type = dto.Type;
            if (dto.DayOfWeek != null) session.DayOfWeek = dto.DayOfWeek;
            if (dto.StartTime.HasValue) session.StartTime = dto.StartTime.Value;
            if (dto.EndTime.HasValue) session.EndTime = dto.EndTime.Value;
            if (dto.GroupName != null) session.GroupName = dto.GroupName;
            if (dto.MaxCapacity.HasValue) session.MaxCapacity = dto.MaxCapacity.Value;
            if (dto.MinCapacity.HasValue) session.MinCapacity = dto.MinCapacity.Value;
            if (dto.IsActive.HasValue) session.IsActive = dto.IsActive.Value;
            if (dto.Location != null) session.Location = dto.Location;
            if (dto.Notes != null) session.Notes = dto.Notes;

            int deletedCount = 0;

            // Ako se promijenio raspored — obriši SVE rezervacije za ovaj trening
            if (scheduleChanged && session.Registrations.Any())
            {
                deletedCount = session.Registrations.Count;
                _context.TrainingRegistrations.RemoveRange(session.Registrations);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = scheduleChanged && deletedCount > 0
                    ? $"Trening ažuriran. Obrisano {deletedCount} rezervacija zbog promjene rasporeda."
                    : "Trening ažuriran.",
                deletedRegistrations = deletedCount
            });
        }

        // DELETE api/trainingsessions/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var session = await _context.TrainingSessions
                .Include(s => s.Registrations)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (session == null) return NotFound();

            _context.TrainingRegistrations.RemoveRange(session.Registrations);
            _context.TrainingSessions.Remove(session);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Trening '{session.GroupName}' i {session.Registrations.Count} rezervacija obrisano." });
        }
    }
}