using AtrevidoFitness.API.Data;
using AtrevidoFitness.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Services
{
    public class ChallengeLifecycleService : BackgroundService
    {
        private const string ActiveStatus = "Active";
        private const string CompletedStatus = "Completed";

        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ChallengeLifecycleService> _logger;

        public ChallengeLifecycleService(
            IServiceProvider serviceProvider,
            ILogger<ChallengeLifecycleService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        public static DateTime GetMonthStart(DateTime value)
        {
            return new DateTime(value.Year, value.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        }

        public static DateTime GetNextMonthStart(DateTime value)
        {
            return GetMonthStart(value).AddMonths(1);
        }

        public static DateTime GetMonthEnd(DateTime value)
        {
            return GetNextMonthStart(value).AddTicks(-1);
        }

        public static bool IsSameMonth(DateTime first, DateTime second)
        {
            return first.Year == second.Year && first.Month == second.Month;
        }

        private static string GetBosnianMonthName(int month)
        {
            return month switch
            {
                1 => "Januar",
                2 => "Februar",
                3 => "Mart",
                4 => "April",
                5 => "Maj",
                6 => "Juni",
                7 => "Juli",
                8 => "August",
                9 => "Septembar",
                10 => "Oktobar",
                11 => "Novembar",
                12 => "Decembar",
                _ => throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.")
            };
        }

        public static async Task EnsureMonthlyChallengeAsync(
            AppDbContext context,
            DateTime now,
            CancellationToken cancellationToken = default)
        {
            var currentMonthStart = GetMonthStart(now);
            var nextMonthStart = currentMonthStart.AddMonths(1);

            var oldActiveChallenges = await context.Challenges
                .Where(c => c.Status == ActiveStatus && c.StartDate < currentMonthStart)
                .ToListAsync(cancellationToken);

            foreach (var challenge in oldActiveChallenges)
                challenge.Status = CompletedStatus;

            var futureActiveChallenges = await context.Challenges
                .Where(c => c.Status == ActiveStatus && c.StartDate >= nextMonthStart)
                .ToListAsync(cancellationToken);

            foreach (var challenge in futureActiveChallenges)
                challenge.Status = "Upcoming";

            var currentMonthActiveChallenges = await context.Challenges
                .Where(c =>
                    c.Status == ActiveStatus
                    && c.StartDate >= currentMonthStart
                    && c.StartDate < nextMonthStart)
                .OrderBy(c => c.StartDate)
                .ThenBy(c => c.Id)
                .ToListAsync(cancellationToken);

            foreach (var duplicate in currentMonthActiveChallenges.Skip(1))
                duplicate.Status = CompletedStatus;

            if (currentMonthActiveChallenges.Count == 0)
            {
                var existingCurrentMonthChallenge = await context.Challenges
                    .Where(c => c.StartDate >= currentMonthStart && c.StartDate < nextMonthStart)
                    .OrderBy(c => c.StartDate)
                    .ThenBy(c => c.Id)
                    .FirstOrDefaultAsync(cancellationToken);

                if (existingCurrentMonthChallenge != null)
                {
                    existingCurrentMonthChallenge.Status = ActiveStatus;
                    existingCurrentMonthChallenge.IsPublic = true;
                }
                else
                {
                    var title = $"{GetBosnianMonthName(currentMonthStart.Month)} {currentMonthStart.Year} Mjesečni Izazov";
                    context.Challenges.Add(new Challenge
                    {
                        Title = title,
                        Description = "Mjesečni izazov za praćenje fitness napretka.",
                        Rules = "Bilježite svoj napredak tokom mjeseca. Rang-lista se računa na osnovu promjene težine, struka, ruke i noge.",
                        StartDate = currentMonthStart,
                        EndDate = GetMonthEnd(now),
                        Status = ActiveStatus,
                        IsPublic = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }

            await context.SaveChangesAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    await EnsureMonthlyChallengeAsync(context, DateTime.UtcNow, stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error while ensuring monthly challenge lifecycle.");
                }

                await Task.Delay(TimeSpan.FromHours(12), stoppingToken);
            }
        }
    }
}
