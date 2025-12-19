namespace LaborUnion.Domain.Entities
{
    public class Sector : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public virtual ICollection<SectorUser> SectorUsers { get; set; } = [];
    }
}
