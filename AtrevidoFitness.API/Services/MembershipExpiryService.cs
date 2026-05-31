using AtrevidoFitness.API.Data;
using Microsoft.EntityFrameworkCore;

namespace AtrevidoFitness.API.Services
{
    public class MembershipExpiryService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MembershipExpiryService> _logger;

        public MembershipExpiryService(
            IServiceProvider serviceProvider,
            ILogger<MembershipExpiryService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckExpiredMemberships();
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task CheckExpiredMemberships()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var now = DateTime.UtcNow;

                var expiredMemberships = await context.UserTrainingMemberships
                    .Include(m => m.User)
                    .Where(m => m.Status == "Active"
                             && m.EndDate.HasValue
                             && m.EndDate.Value < now)
                    .ToListAsync();

                foreach (var membership in expiredMemberships)
                {
                    membership.Status = "Inactive";
                    if (membership.User != null)
                        membership.User.IsActive = false;

                    _logger.LogInformation(
                        "Membership istekao za usera {UserId}.", membership.UserId);
                }

                if (expiredMemberships.Any())
                    await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Greška pri provjeri isteklih memberships.");
            }
        }
    }
}