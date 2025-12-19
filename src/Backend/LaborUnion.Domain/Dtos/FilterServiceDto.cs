namespace LaborUnion.Domain.Dtos
{
    public class FilterServiceDto
    {
        public int? FarmerId { get; set; }
        public string? FarmerName { get; set; }
        public string? FarmerCpf { get; set; }
        public DateOnly? ServiceDate { get; set; }
        public int? AttendantId { get; set; }
    }
}
