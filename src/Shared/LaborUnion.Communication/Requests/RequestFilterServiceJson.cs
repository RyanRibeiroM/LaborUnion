using LaborUnion.Communication.Enums;

namespace LaborUnion.Communication.Requests
{
    public class RequestFilterServiceJson
    {
        public int? FarmerId { get; set; }
        public string? FarmerName { get; set; }
        public string? FarmerCpf { get; set; }
        public DateOnly? ServiceDate { get; set; }
        public int? AttendantId { get; set; }
        public string? AttendantName { get; set; }
        public ServiceStatus? Status { get; set; }
        public int? ServiceTypeId { get; set; }
        public string? ServiceTypeName { get; set; }
        public int? SectorId { get; set; }
        public string? SectorName { get; set; }
    }
}
