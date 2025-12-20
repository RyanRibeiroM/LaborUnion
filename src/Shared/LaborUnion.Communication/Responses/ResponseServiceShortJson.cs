namespace LaborUnion.Communication.Responses
{
    public class ResponseServiceShortJson
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public string SectorName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
