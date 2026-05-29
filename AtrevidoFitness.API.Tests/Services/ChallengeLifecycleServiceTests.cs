using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Services;
using AtrevidoFitness.API.Tests.Helpers;

namespace AtrevidoFitness.API.Tests.Services;

public class ChallengeLifecycleServiceTests
{
    [Fact]
    public void GetMonthStart_ReturnsFirstDayOfMonth()
    {
        var date = new DateTime(2026, 5, 15);

        var result = ChallengeLifecycleService.GetMonthStart(date);

        Assert.Equal(new DateTime(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc), result);
    }

    [Fact]
    public void GetNextMonthStart_ReturnsNextMonth()
    {
        var date = new DateTime(2026, 5, 15);

        var result = ChallengeLifecycleService.GetNextMonthStart(date);

        Assert.Equal(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc), result);
    }

    [Fact]
    public void GetMonthEnd_ReturnsLastMomentOfMonth()
    {
        var date = new DateTime(2026, 5, 15);

        var result = ChallengeLifecycleService.GetMonthEnd(date);

        Assert.Equal(5, result.Month);
        Assert.Equal(31, result.Day);
    }

    [Fact]
    public void IsSameMonth_ReturnsTrue_WhenSameMonth()
    {
        var result = ChallengeLifecycleService.IsSameMonth(
            new DateTime(2026, 5, 1),
            new DateTime(2026, 5, 20));

        Assert.True(result);
    }

    [Fact]
    public void IsSameMonth_ReturnsFalse_WhenDifferentMonth()
    {
        var result = ChallengeLifecycleService.IsSameMonth(
            new DateTime(2026, 5, 1),
            new DateTime(2026, 6, 1));

        Assert.False(result);
    }

    [Fact]
    public async Task EnsureMonthlyChallengeAsync_CreatesChallenge_WhenNoneExists()
    {
        var context = TestDbContextFactory.CreateTestContext();

        await ChallengeLifecycleService.EnsureMonthlyChallengeAsync(
            context,
            new DateTime(2026, 5, 15));

        var challenge = context.Challenges.FirstOrDefault();

        Assert.NotNull(challenge);
        Assert.Equal("Active", challenge!.Status);
        Assert.True(challenge.IsPublic);
    }

    [Fact]
    public async Task EnsureMonthlyChallengeAsync_CompletesOldChallenges()
    {
        var context = TestDbContextFactory.CreateTestContext();

        context.Challenges.Add(new Challenge
        {
            Title = "Old Challenge",
            Description = "Test",
            Rules = "Rules",
            StartDate = new DateTime(2026, 4, 1),
            EndDate = new DateTime(2026, 4, 30),
            Status = "Active"
        });

        await context.SaveChangesAsync();

        await ChallengeLifecycleService.EnsureMonthlyChallengeAsync(
            context,
            new DateTime(2026, 5, 15));

        var challenge = context.Challenges.First();

        Assert.Equal("Completed", challenge.Status);
    }

    [Fact]
    public async Task EnsureMonthlyChallengeAsync_ActivatesExistingCurrentMonthChallenge()
    {
        var context = TestDbContextFactory.CreateTestContext();

        context.Challenges.Add(new Challenge
        {
            Title = "May Challenge",
            Description = "Test",
            Rules = "Rules",
            StartDate = new DateTime(2026, 5, 1),
            EndDate = new DateTime(2026, 5, 31),
            Status = "Upcoming",
            IsPublic = false
        });

        await context.SaveChangesAsync();

        await ChallengeLifecycleService.EnsureMonthlyChallengeAsync(
            context,
            new DateTime(2026, 5, 10));

        var challenge = context.Challenges.First();

        Assert.Equal("Active", challenge.Status);
        Assert.True(challenge.IsPublic);
    }
}