namespace AtrevidoFitness.API.DTOs
{
    public class ChallengeLeaderboardDto
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Score { get; set; }
        public int Rank { get; set; }
    }
}
