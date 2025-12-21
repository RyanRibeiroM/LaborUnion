namespace LaborUnion.Domain.Entities
{
    public class Document : EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public int FarmerId { get; set; }
        public virtual Farmer Farmer { get; set; } = default!;
    }
}
