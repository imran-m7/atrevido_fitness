<<<<<<< Updated upstream
namespace AtrevidoFitness.API.DTOs 

{ 
    public class BlogPostResponseDto 
    { 
        public int Id { get; set; } 
        public string Title { get; set; } = string.Empty; 
        public string Content { get; set; } = string.Empty; 
        public string? ImageUrl { get; set; } 
        public string? ImageBase64 { get; set; } 
        public string Category { get; set; } = string.Empty; 
        public bool IsPublished { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime? PublishedAt { get; set; } 
        public int AuthorId { get; set; } 
    } 
  
    public class BlogPostCreateDto 
    { 
        public string Title { get; set; } = string.Empty; 
        public string Content { get; set; } = string.Empty; 
        public string? ImageUrl { get; set; } 
        public string? ImageBase64 { get; set; } 
        public string Category { get; set; } = string.Empty; 
        public bool IsPublished { get; set; } 
    } 
  
    public class BlogPostUpdateDto 
    { 
        public string? Title { get; set; } 
        public string? Content { get; set; } 
        public string? ImageUrl { get; set; } 
        public string? ImageBase64 { get; set; } 
        public string? Category { get; set; } 
        public bool? IsPublished { get; set; } 
        public DateTime? PublishedAt { get; set; } 
    } 
=======
namespace AtrevidoFitness.API.DTOs
{
    public class BlogPostResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public int AuthorId { get; set; }
    }

    public class BlogPostCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
    }

    public class BlogPostUpdateDto
    {
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string? Category { get; set; }
        public bool? IsPublished { get; set; }
        public DateTime? PublishedAt { get; set; }
    }
>>>>>>> Stashed changes
}