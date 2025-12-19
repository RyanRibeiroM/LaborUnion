using LaborUnion.Communication.Enums;

namespace LaborUnion.Communication.Requests
{
    public class RequestRegisterServiceJson
    {
        public int ServiceTypeId { get; set; }
        public int FarmerId { get; set; }
        public ServiceStatus Status { get; set; }
        public int SectorId { get; set; }
        public string? Notes { get; set; }
    }
}
