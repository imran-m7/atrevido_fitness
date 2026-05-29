using AtrevidoFitness.API.Models.Entities;
using AtrevidoFitness.API.Services;
using AtrevidoFitness.API.Tests.Helpers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using System.Reflection;

namespace AtrevidoFitness.API.Tests.Services;

public class MembershipExpiryServiceTests
{
    [Fact]
    public async Task ExpiredMembership_BecomesInactive()
    {
        var context = TestDbContextFactory.CreateTestContext();

        var user = new User
        {
            FirstName = "John",
            LastName = "Doe",
            Username = "john",
            PasswordHash = "hash",
            Role = "Member",
            IsActive = true
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        var membership = new UserTrainingMembership
        {
            UserId = user.Id,
            User = user,
            Status = "Active",
            EndDate = DateTime.UtcNow.AddDays(-1)
        };

        context.UserTrainingMemberships.Add(membership);
        await context.SaveChangesAsync();

        var services = new ServiceCollection();
        services.AddSingleton(context);

        var provider = services.BuildServiceProvider();

        var logger = Mock.Of<ILogger<MembershipExpiryService>>();

        var service = new MembershipExpiryService(provider, logger);

        var method = typeof(MembershipExpiryService)
            .GetMethod("CheckExpiredMemberships", BindingFlags.NonPublic | BindingFlags.Instance);

        await (Task)method!.Invoke(service, null)!;

        Assert.Equal("Inactive", membership.Status);
        Assert.False(user.IsActive);
    }
}