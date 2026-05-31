namespace AtrevidoFitness.API.DTOs
{
    public class ChallengeParticipantResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ChallengeId { get; set; }
        public DateTime JoinedAt { get; set; }
        public string Status { get; set; } = string.Empty;
        public string UserFirstName { get; set; } = string.Empty;
        public string UserLastName { get; set; } = string.Empty;
    }

    public class ChallengeParticipantCreateDto
    {
        public int ChallengeId { get; set; }
    }

    public class ChallengeParticipantUpdateDto
    {
        public string? Status { get; set; }
    }
}
