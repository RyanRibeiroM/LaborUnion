namespace LaborUnion.Communication.Responses
{
    public class ResponseDocumentShortJson
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateOnly DueDate { get; set; }
        public string FarmerName { get; set; } = string.Empty;
    }
}
