using LaborUnion.Communication.Enums;

namespace LaborUnion.Communication.Requests
{
    public class RequestUpdateServiceJson
    {
        public int ServiceTypeId { get; set; }
        public ServiceStatus Status { get; set; }
        public int SectorId { get; set; }
        public string? Notes { get; set; }
    }
}
