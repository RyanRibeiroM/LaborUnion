namespace LaborUnion.Communication.Requests
{
    public class RequestFilterDocumentJson
    {
        public string? Name { get; set; }
        public bool? IsExpired { get; set; }
        public int? FarmerId { get; set; }
        public string? FarmerName { get; set; }
        public DateOnly? CreatedOn { get; set; }
        public DateOnly? DueDate { get; set; }
    }
}
