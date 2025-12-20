namespace LaborUnion.Communication.Responses
{
    public class ResponseServiceJson
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public int ServiceTypeId { get; set; }
        public string ServiceTypeName { get; set; } = string.Empty;
        public int FarmerId { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public string FarmerCpf { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int SectorId { get; set; }
        public string SectorName { get; set; } = string.Empty;
        public int AttendantId { get; set; }
        public string AttendantName { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }
}
