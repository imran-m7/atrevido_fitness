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
    public class TrainingSessionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrainingSessionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/trainingsessions — javno
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sessions = await _context.TrainingSessions
                .Where(s => s.IsActive)
                .Include(s => s.Registrations)
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
                Notes = s.Notes
            });

            return Ok(result);
        }

        // POST api/trainingsessions — samo Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(
            [FromBody] TrainingSessionCreateDto dto)
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

        // PUT api/trainingsessions/{id} — samo Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromBody] TrainingSessionUpdateDto dto)
        {
            var session = await _context.TrainingSessions.FindAsync(id);
            if (session == null) return NotFound();

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

            await _context.SaveChangesAsync();
            return Ok(new { message = "Session updated." });
        }

        // DELETE api/trainingsessions/{id} — samo Admin
        // NOVO — hard delete
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var session = await _context.TrainingSessions.FindAsync(id);
            if (session == null) return NotFound();

            _context.TrainingSessions.Remove(session);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}