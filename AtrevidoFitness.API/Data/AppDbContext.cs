// Data/AppDbContext.cs
using AtrevidoFitness.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        
        public DbSet<User> Users { get; set; }
        public DbSet<UserTrainingMembership> UserTrainingMemberships { get; set; }
        public DbSet<TrainingSession> TrainingSessions { get; set; }
        public DbSet<TrainingRegistration> TrainingRegistrations { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<ChallengeParticipant> ChallengeParticipants { get; set; }
        public DbSet<ProgressEntry> ProgressEntries { get; set; }
        public DbSet<NutritionPlan> NutritionPlans { get; set; }
        public DbSet<NutritionRecipe> NutritionRecipes { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //  User 
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            //  UserTrainingMembership 
            modelBuilder.Entity<UserTrainingMembership>()
                .HasOne(m => m.User)
                .WithOne(u => u.TrainingMembership)
                .HasForeignKey<UserTrainingMembership>(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            //  TrainingRegistration 
            // Clanica ne moze dva puta isti dan isti termin
            modelBuilder.Entity<TrainingRegistration>()
                .HasIndex(r => new { r.UserId, r.TrainingSessionId, r.SessionDate })
                .IsUnique();

            modelBuilder.Entity<TrainingRegistration>()
                .HasOne(r => r.User)
                .WithMany(u => u.TrainingRegistrations)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TrainingRegistration>()
                .HasOne(r => r.TrainingSession)
                .WithMany(s => s.Registrations)
                .HasForeignKey(r => r.TrainingSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            //  ChallengeParticipant 
            // Clanica ne moze dvaput uci u isti challenge
            modelBuilder.Entity<ChallengeParticipant>()
                .HasIndex(cp => new { cp.UserId, cp.ChallengeId })
                .IsUnique();

            //  ProgressEntry 
            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.WeightKg)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.WaistCm)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.HipsCm)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.ChestCm)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.ArmCm)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.ThighCm)
                .HasPrecision(5, 2);

            //  NutritionPlan 
            modelBuilder.Entity<NutritionPlan>()
                .HasOne(n => n.AssignedToUser)
                .WithMany()
                .HasForeignKey(n => n.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull);

            //  BlogPost 
            modelBuilder.Entity<BlogPost>()
                .HasOne(b => b.Author)
                .WithMany()
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FirstName = "Dika",
                LastName = "Admin",
                Username="dika.admin",
                Email = "dika@atrevido.ba",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}