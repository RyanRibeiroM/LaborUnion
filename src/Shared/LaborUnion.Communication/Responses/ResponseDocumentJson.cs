namespace LaborUnion.Communication.Responses
{
    public class ResponseDocumentJson
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public string FarmerName { get; set; } = string.Empty;
        public string FarmerCpf { get; set; } = string.Empty;
    }
}
