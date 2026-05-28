using AtrevidoFitness.API.Data;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Tests.Helpers;

public static class TestDbContextFactory
{
    /// <summary>
    /// Creates a fresh AppDbContext with InMemoryDatabase for testing.
    /// Each call gets a unique database to ensure test isolation.
    /// </summary>
    public static AppDbContext CreateTestContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}
