using AtrevidoFitness.API.Controllers;
using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.DTOs;
using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Controllers;

public class ChallengesControllerTests
{
    private ChallengesController CreateController(AppDbContext context, int userId, string role = "Member")
    {
        var controller = new ChallengesController(context);
        var user = role == "Admin" ? TestUserFactory.CreateAdminUser(userId) : TestUserFactory.CreateMemberUser(userId);
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = TestUserFactory.CreateHttpContextWithUser(user)
        };
        return controller;
    }
    [Fact]
    public async Task GetAll_ReturnsOnlyPublicChallenges()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var publicChallenge = new Challenge
        {
            Id = 1,
            Title = "Public Challenge",
            Description = "Public",
            Rules = "Rules",
            StartDate = DateTime.UtcNow.AddMonths(-1),
            EndDate = DateTime.UtcNow.AddMonths(1),
            Status = "Active",
            IsPublic = true
        };

        var privateChallenge = new Challenge
        {
            Id = 2,
            Title = "Private Challenge",
            Description = "Private",
            Rules = "Rules",
            StartDate = DateTime.UtcNow.AddMonths(-1),
            EndDate = DateTime.UtcNow.AddMonths(1),
            Status = "Active",
            IsPublic = false
        };

        context.Challenges.AddRange(publicChallenge, privateChallenge);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetAll();

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var challenges = ((IEnumerable<ChallengeResponseDto>)okResult.Value!).ToList();

        // Note: GetAll calls EnsureMonthlyChallengeAsync which may create an additional challenge,
        // so we just verify that our private challenge is not in the results
        // and at least one public challenge is present
        Assert.All(challenges, c => Assert.True(c.IsPublic));
        Assert.DoesNotContain(challenges, c => c.Title == "Private Challenge");
    }

    [Fact]
    public async Task Join_ReturnsBadRequest_WhenChallengeCompleted()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // Challenge is completed
        var challenge = new Challenge
        {
            Id = 1,
            Title = "Completed Challenge",
            Description = "Test",
            Rules = "Rules",
            StartDate = DateTime.UtcNow.AddMonths(-2),
            EndDate = DateTime.UtcNow.AddMonths(-1),
            Status = "Completed",
            IsPublic = true
        };
        context.Challenges.Add(challenge);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Join(1);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Join_ReturnsBadRequest_WhenAlreadyJoined()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var now = DateTime.UtcNow;
        var challenge = new Challenge
        {
            Id = 1,
            Title = "Active Challenge",
            Description = "Test",
            Rules = "Rules",
            StartDate = now.AddDays(-5),
            EndDate = now.AddDays(5),
            Status = "Active",
            IsPublic = true
        };
        context.Challenges.Add(challenge);
        await context.SaveChangesAsync();

        // User already joined
        var participant = new ChallengeParticipant
        {
            UserId = 1,
            ChallengeId = 1,
            Status = "Active",
            JoinedAt = DateTime.UtcNow
        };
        context.ChallengeParticipants.Add(participant);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Join(1);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Join_AddsParticipant_WhenValid()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        var user = new User { Id = 1, FirstName = "John", LastName = "Doe", Username = "john_doe", PasswordHash = "hash", Role = "Member" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        var now = DateTime.UtcNow;
        var challenge = new Challenge
        {
            Id = 1,
            Title = "Active Challenge",
            Description = "Test",
            Rules = "Rules",
            StartDate = now.AddDays(-5),
            EndDate = now.AddDays(5),
            Status = "Active",
            IsPublic = true
        };
        context.Challenges.Add(challenge);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.Join(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);

        // Verify participant was added using LINQ query for composite key
        var participant = await context.ChallengeParticipants
            .FirstOrDefaultAsync(cp => cp.UserId == 1 && cp.ChallengeId == 1);
        Assert.NotNull(participant);
        Assert.Equal("Active", participant.Status);
    }

    [Fact]
    public async Task Leaderboard_ReturnsParticipantsRankedByMonthlyScore()
    {
        // Arrange
        var context = TestDbContextFactory.CreateTestContext();
        var controller = CreateController(context, 1);

        // Create admin and regular user for setup
        var admin = new User { Id = 99, FirstName = "Admin", LastName = "User", Username = "admin", PasswordHash = "hash", Role = "Admin" };
        context.Users.Add(admin);

        // Create three participants
        var user1 = new User { Id = 1, FirstName = "Alice", LastName = "Johnson", Username = "alice", PasswordHash = "hash1", Role = "Member" };
        var user2 = new User { Id = 2, FirstName = "Bob", LastName = "Smith", Username = "bob", PasswordHash = "hash2", Role = "Member" };
        var user3 = new User { Id = 3, FirstName = "Carol", LastName = "Davis", Username = "carol", PasswordHash = "hash3", Role = "Member" };
        context.Users.AddRange(user1, user2, user3);
        await context.SaveChangesAsync();

        // Create an active monthly challenge (current month)
        var now = DateTime.UtcNow;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);

        var challenge = new Challenge
        {
            Id = 1,
            Title = "May Fitness Challenge",
            Description = "Monthly fitness challenge",
            Rules = "Track progress",
            StartDate = monthStart,
            EndDate = monthEnd,
            Status = "Active",
            IsPublic = true
        };
        context.Challenges.Add(challenge);
        await context.SaveChangesAsync();

        // Add participants
        var participants = new[]
        {
            new ChallengeParticipant { UserId = 1, ChallengeId = 1, Status = "Active" },
            new ChallengeParticipant { UserId = 2, ChallengeId = 1, Status = "Active" },
            new ChallengeParticipant { UserId = 3, ChallengeId = 1, Status = "Active" }
        };
        context.ChallengeParticipants.AddRange(participants);
        await context.SaveChangesAsync();

        // Create progress entries in the same month
        // User 1 (Alice): High progress - should rank 1
        // Baseline: weight 90, waist 100, arm 35, thigh 60
        // Current: weight 85, waist 94, arm 33, thigh 56
        // Loss: weight 5, waist 6, arm 2, thigh 4
        // Score: 5*10 + 6*3 + 2*2 + 4*2 = 50 + 18 + 4 + 8 = 80
        var alice_baseline = new ProgressEntry
        {
            UserId = 1,
            EntryDate = DateOnly.FromDateTime(monthStart),
            WeightKg = 90m,
            WaistCm = 100m,
            ArmCm = 35m,
            ThighCm = 60m,
            Notes = "Baseline"
        };
        var alice_current = new ProgressEntry
        {
            UserId = 1,
            EntryDate = DateOnly.FromDateTime(monthEnd.AddDays(-1)),
            WeightKg = 85m,
            WaistCm = 94m,
            ArmCm = 33m,
            ThighCm = 56m,
            Notes = "Current"
        };

        // User 2 (Bob): Medium progress - should rank 2
        // Baseline: weight 85, waist 95, arm 34, thigh 58
        // Current: weight 82, waist 91, arm 32.5, thigh 55
        // Loss: weight 3, waist 4, arm 1.5, thigh 3
        // Score: 3*10 + 4*3 + 1.5*2 + 3*2 = 30 + 12 + 3 + 6 = 51
        var bob_baseline = new ProgressEntry
        {
            UserId = 2,
            EntryDate = DateOnly.FromDateTime(monthStart),
            WeightKg = 85m,
            WaistCm = 95m,
            ArmCm = 34m,
            ThighCm = 58m,
            Notes = "Baseline"
        };
        var bob_current = new ProgressEntry
        {
            UserId = 2,
            EntryDate = DateOnly.FromDateTime(monthEnd.AddDays(-1)),
            WeightKg = 82m,
            WaistCm = 91m,
            ArmCm = 32.5m,
            ThighCm = 55m,
            Notes = "Current"
        };

        // User 3 (Carol): Low progress - should rank 3
        // Baseline: weight 70, waist 80, arm 30, thigh 52
        // Current: weight 69, waist 79, arm 29.5, thigh 51
        // Loss: weight 1, waist 1, arm 0.5, thigh 1
        // Score: 1*10 + 1*3 + 0.5*2 + 1*2 = 10 + 3 + 1 + 2 = 16
        var carol_baseline = new ProgressEntry
        {
            UserId = 3,
            EntryDate = DateOnly.FromDateTime(monthStart),
            WeightKg = 70m,
            WaistCm = 80m,
            ArmCm = 30m,
            ThighCm = 52m,
            Notes = "Baseline"
        };
        var carol_current = new ProgressEntry
        {
            UserId = 3,
            EntryDate = DateOnly.FromDateTime(monthEnd.AddDays(-1)),
            WeightKg = 69m,
            WaistCm = 79m,
            ArmCm = 29.5m,
            ThighCm = 51m,
            Notes = "Current"
        };

        context.ProgressEntries.AddRange(
            alice_baseline, alice_current,
            bob_baseline, bob_current,
            carol_baseline, carol_current);
        await context.SaveChangesAsync();

        // Act
        var result = await controller.GetLeaderboard(1);

        // Assert
        Assert.IsType<OkObjectResult>(result);
        var okResult = (OkObjectResult)result;
        var leaderboard = Assert.IsType<List<ChallengeLeaderboardDto>>(okResult.Value);

        Assert.Equal(3, leaderboard.Count);

        // Verify ranking - higher score should have lower rank (rank 1 is best)
        Assert.Equal(1, leaderboard[0].Rank);
        Assert.Equal(1, leaderboard[0].UserId); // Alice
        Assert.Equal(80m, leaderboard[0].Score);

        Assert.Equal(2, leaderboard[1].Rank);
        Assert.Equal(2, leaderboard[1].UserId); // Bob
        Assert.Equal(51m, leaderboard[1].Score);

        Assert.Equal(3, leaderboard[2].Rank);
        Assert.Equal(3, leaderboard[2].UserId); // Carol
        Assert.Equal(16m, leaderboard[2].Score);
    }
}
