namespace LaborUnion.Domain.Entities
{
    public class ServiceType : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int SectorId { get; set; }
        public virtual Sector Sector { get; set; } = default!;
    }
}
