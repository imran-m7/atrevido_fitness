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
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/blog — javno
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _context.BlogPosts
                .Where(b => b.IsPublished)
                .OrderByDescending(b => b.PublishedAt)
                .Select(b => new BlogPostResponseDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Content = b.Content,
                    ImageUrl = b.ImageUrl,
                    Category = b.Category,
                    IsPublished = b.IsPublished,
                    CreatedAt = b.CreatedAt,
                    PublishedAt = b.PublishedAt,
                    AuthorId = b.AuthorId
                })
                .ToListAsync();

            return Ok(posts);
        }

        // GET api/blog/{id} — javno
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _context.BlogPosts
                .FirstOrDefaultAsync(b => b.Id == id && b.IsPublished);

            if (post == null) return NotFound();

            return Ok(new BlogPostResponseDto
            {
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                Category = post.Category,
                IsPublished = post.IsPublished,
                CreatedAt = post.CreatedAt,
                PublishedAt = post.PublishedAt,
                AuthorId = post.AuthorId
            });
        }

        // POST api/blog — samo Admin
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] BlogPostCreateDto dto)
        {
            var authorId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var post = new BlogPost
            {
                Title = dto.Title,
                Content = dto.Content,
                ImageUrl = dto.ImageUrl,
                Category = dto.Category,
                IsPublished = dto.IsPublished,
                AuthorId = authorId, // iz tokena
                PublishedAt = dto.IsPublished ? DateTime.UtcNow : null
            };

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = post.Id }, post);
        }

        // PUT api/blog/{id} — samo Admin
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id,
            [FromBody] BlogPostUpdateDto dto)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return NotFound();

            if (dto.Title != null) post.Title = dto.Title;
            if (dto.Content != null) post.Content = dto.Content;
            if (dto.ImageUrl != null) post.ImageUrl = dto.ImageUrl;
            if (dto.Category != null) post.Category = dto.Category;
            if (dto.IsPublished.HasValue)
            {
                post.IsPublished = dto.IsPublished.Value;
                if (dto.IsPublished.Value && post.PublishedAt == null)
                    post.PublishedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Post updated." });
        }

        // DELETE api/blog/{id} — samo Admin
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return NotFound();

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}