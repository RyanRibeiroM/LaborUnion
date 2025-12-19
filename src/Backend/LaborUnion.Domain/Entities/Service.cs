using LaborUnion.Domain.Enums;

namespace LaborUnion.Domain.Entities
{
    public class Service : EntityBase
    {
        public int ServiceTypeId { get; set; }
        public virtual ServiceType ServiceType { get; set; } = default!;
        public int FarmerId { get; set; }
        public virtual Farmer Farmer { get; set; } = default!;
        public int AttendantId { get; set; }
        public virtual User Attendant { get; set; } = default!;
        public ServiceStatus Status { get; set; }
        public int SectorId { get; set; }
        public virtual Sector Sector { get; set; } = default!;
        public string? Notes { get; set; }
    }
}
