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
            modelBuilder.Entity<ChallengeParticipant>()
                .HasIndex(cp => new { cp.UserId, cp.ChallengeId })
                .IsUnique();

            //  ProgressEntry 
            modelBuilder.Entity<ProgressEntry>()
                .Property(p => p.WeightKg)
                .HasPrecision(5, 2);

            modelBuilder.Entity<ProgressEntry>()
    .Property(p => p.HeightCm)
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

            // =====================
            //  SEED DATA
            // =====================

            // Admin
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
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });

            // 4 Members
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 2,
                    FirstName = "Sarah",
                    LastName = "Johnson",
                    Email = "sarah@atrevido.ba",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member123!"),
                    Role = "Member",
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 3,
                    FirstName = "Maria",
                    LastName = "Smith",
                    Email = "maria@atrevido.ba",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member123!"),
                    Role = "Member",
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 1, 20, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 4,
                    FirstName = "Jennifer",
                    LastName = "Kane",
                    Email = "jennifer@atrevido.ba",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member123!"),
                    Role = "Member",
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 5,
                    FirstName = "Amanda",
                    LastName = "Ross",
                    Email = "amanda@atrevido.ba",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member123!"),
                    Role = "Member",
                    IsActive = true,
                    CreatedAt = new DateTime(2026, 2, 10, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // Challenges
            modelBuilder.Entity<Challenge>().HasData(
                new Challenge
                {
                    Id = 1,
                    Title = "30-Day Fitness Challenge",
                    Description = "Who can lose the most weight in a month?",
                    Rules = "Have fun",
                    StartDate = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 4, 30, 0, 0, 0, DateTimeKind.Utc),
                    Status = "Active",
                    IsPublic = true,
                    CreatedAt = new DateTime(2026, 3, 25, 0, 0, 0, DateTimeKind.Utc)
                },
                new Challenge
                {
                    Id = 2,
                    Title = "Weekly Fitness Challenge",
                    Description = "Who can lose the most weight in a week?",
                    Rules = "Have fun",
                    StartDate = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc),
                    EndDate = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc),
                    Status = "Active",
                    IsPublic = true,
                    CreatedAt = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ChallengeParticipants — all 4 members joined both challenges
            modelBuilder.Entity<ChallengeParticipant>().HasData(
                // Sarah - both challenges
                new ChallengeParticipant { Id = 1, UserId = 2, ChallengeId = 1, JoinedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ChallengeParticipant { Id = 2, UserId = 2, ChallengeId = 2, JoinedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc) },
                // Maria - both challenges
                new ChallengeParticipant { Id = 3, UserId = 3, ChallengeId = 1, JoinedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ChallengeParticipant { Id = 4, UserId = 3, ChallengeId = 2, JoinedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc) },
                // Jennifer - both challenges
                new ChallengeParticipant { Id = 5, UserId = 4, ChallengeId = 1, JoinedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ChallengeParticipant { Id = 6, UserId = 4, ChallengeId = 2, JoinedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc) },
                // Amanda - both challenges
                new ChallengeParticipant { Id = 7, UserId = 5, ChallengeId = 1, JoinedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc) },
                new ChallengeParticipant { Id = 8, UserId = 5, ChallengeId = 2, JoinedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc) }
            );

            // Progress entries - Sarah (UserId: 2)
            modelBuilder.Entity<ProgressEntry>().HasData(
                new ProgressEntry
                {
                    Id = 1,
                    UserId = 2,
                    EntryDate = new DateOnly(2026, 4, 1),
                    WeightKg = 72.50m,
                    WaistCm = 78.00m,
                    HipsCm = 96.00m,
                    ChestCm = 88.00m,
                    ArmCm = 28.00m,
                    ThighCm = 54.00m,
                    Notes = "Starting measurements",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ProgressEntry
                {
                    Id = 2,
                    UserId = 2,
                    EntryDate = new DateOnly(2026, 4, 10),
                    WeightKg = 71.20m,
                    WaistCm = 77.00m,
                    HipsCm = 95.00m,
                    ChestCm = 87.50m,
                    ArmCm = 27.80m,
                    ThighCm = 53.50m,
                    Notes = "Feeling great!",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc)
                },
                new ProgressEntry
                {
                    Id = 3,
                    UserId = 2,
                    EntryDate = new DateOnly(2026, 4, 20),
                    WeightKg = 70.10m,
                    WaistCm = 76.00m,
                    HipsCm = 94.50m,
                    ChestCm = 87.00m,
                    ArmCm = 27.50m,
                    ThighCm = 53.00m,
                    Notes = "Consistent progress",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc)
                },
                // Maria (UserId: 3)
                new ProgressEntry
                {
                    Id = 4,
                    UserId = 3,
                    EntryDate = new DateOnly(2026, 4, 1),
                    WeightKg = 68.00m,
                    WaistCm = 74.00m,
                    HipsCm = 92.00m,
                    ChestCm = 85.00m,
                    ArmCm = 26.50m,
                    ThighCm = 51.00m,
                    Notes = "Starting measurements",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ProgressEntry
                {
                    Id = 5,
                    UserId = 3,
                    EntryDate = new DateOnly(2026, 4, 15),
                    WeightKg = 66.80m,
                    WaistCm = 73.00m,
                    HipsCm = 91.00m,
                    ChestCm = 84.50m,
                    ArmCm = 26.00m,
                    ThighCm = 50.50m,
                    Notes = "Good progress",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                // Jennifer (UserId: 4)
                new ProgressEntry
                {
                    Id = 6,
                    UserId = 4,
                    EntryDate = new DateOnly(2026, 4, 1),
                    WeightKg = 75.00m,
                    WaistCm = 80.00m,
                    HipsCm = 98.00m,
                    ChestCm = 90.00m,
                    ArmCm = 29.00m,
                    ThighCm = 56.00m,
                    Notes = "Starting measurements",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ProgressEntry
                {
                    Id = 7,
                    UserId = 4,
                    EntryDate = new DateOnly(2026, 4, 20),
                    WeightKg = 73.50m,
                    WaistCm = 79.00m,
                    HipsCm = 97.00m,
                    ChestCm = 89.50m,
                    ArmCm = 28.70m,
                    ThighCm = 55.50m,
                    Notes = "Steady progress",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 20, 0, 0, 0, DateTimeKind.Utc)
                },
                // Amanda (UserId: 5)
                new ProgressEntry
                {
                    Id = 8,
                    UserId = 5,
                    EntryDate = new DateOnly(2026, 4, 1),
                    WeightKg = 65.00m,
                    WaistCm = 70.00m,
                    HipsCm = 89.00m,
                    ChestCm = 83.00m,
                    ArmCm = 25.00m,
                    ThighCm = 49.00m,
                    Notes = "Starting measurements",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new ProgressEntry
                {
                    Id = 9,
                    UserId = 5,
                    EntryDate = new DateOnly(2026, 4, 18),
                    WeightKg = 64.00m,
                    WaistCm = 69.50m,
                    HipsCm = 88.50m,
                    ChestCm = 82.50m,
                    ArmCm = 24.80m,
                    ThighCm = 48.50m,
                    Notes = "Feeling lighter",
                    ChallengeId = 1,
                    CreatedAt = new DateTime(2026, 4, 18, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}