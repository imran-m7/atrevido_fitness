<<<<<<< Updated upstream
﻿namespace AtrevidoFitness.API.Models.Entities 
{ 
    public class BlogPost 
    { 
        public int Id { get; set; } 
        public string Title { get; set; } = string.Empty; 
        public string Content { get; set; } = string.Empty; 
        public string? ImageUrl { get; set; } 
        public string? ImageBase64 { get; set; } 
        public string Category { get; set; } = string.Empty; 
        public bool IsPublished { get; set; } = false; 
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; 
        public DateTime? PublishedAt { get; set; } 
        public int AuthorId { get; set; } 
        public User Author { get; set; } = null!; 
    } 
} 
=======
﻿// Models/Entities/BlogPost.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class BlogPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public string Category { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = false;

        public string? ImageBase64 { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PublishedAt { get; set; }

        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
    }
}
>>>>>>> Stashed changes
