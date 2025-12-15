namespace LaborUnion.Domain.Entities
{
    public class RefreshToken : EntityBase
    {
        public required string Value { get; set; } = string.Empty;
        public required int UserId { get; set; }
        public User User { get; set; } = default!;
    }
}
