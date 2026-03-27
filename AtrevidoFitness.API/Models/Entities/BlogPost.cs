// Models/Entities/BlogPost.cs
namespace AtrevidoFitness.API.Models.Entities
{
    public class BlogPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        // "Fitness", "Motivation", "Lifestyle", "Nutrition"
        public string Category { get; set; } = string.Empty;

        public bool IsPublished { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PublishedAt { get; set; }

        // Ko je autor (uvijek Dika, ali za buducnost)
        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;
    }
}