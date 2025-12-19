namespace LaborUnion.Domain.Entities
{
    public class SectorUser : EntityBase
    {
        public int SectorId { get; set; }
        public virtual Sector Sector { get; set; } = default!;

        public int UserId { get; set; }
        public virtual User User { get; set; } = default!;
    }
}
