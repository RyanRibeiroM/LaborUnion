namespace LaborUnion.Communication.Requests
{
    public class RequestRegisterDocumentJson
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly DueDate { get; set; }
        public int FarmerId { get; set; }
    }
}
