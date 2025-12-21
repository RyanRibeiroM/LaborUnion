namespace LaborUnion.Communication.Requests
{
    public class RequestUpdateDocumentJson
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
    }
}
