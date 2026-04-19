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
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactController(AppDbContext context)
        {
            _context = context;
        }

        // POST api/contact — javno, i gost moze
        [HttpPost]
        public async Task<IActionResult> Send(
            [FromBody] ContactMessageCreateDto dto)
        {
            var message = new ContactMessage
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Message = dto.Message,
                Status = "New",
                SentAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully." });
        }

        // GET api/contact — samo Admin
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(m => m.SentAt)
                .Select(m => new ContactMessageResponseDto
                {
                    Id = m.Id,
                    FullName = m.FullName,
                    Email = m.Email,
                    PhoneNumber = m.PhoneNumber,
                    Message = m.Message,
                    Status = m.Status,
                    SentAt = m.SentAt
                })
                .ToListAsync();

            return Ok(messages);
        }

        // PUT api/contact/{id}/status — Admin mijenja status poruke
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id,
            [FromBody] ContactMessageUpdateDto dto)
        {
            var message = await _context.ContactMessages.FindAsync(id);
            if (message == null) return NotFound();

            if (dto.Status != null) message.Status = dto.Status;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated." });
        }
    }
}