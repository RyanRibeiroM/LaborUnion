using LaborUnion.Domain.Enums;

namespace LaborUnion.Domain.Dtos
{
    public class FilterFarmerDto
    {
        public string? Name { get; set; }
        public string? Cpf { get; set; }
        public string? Registration { get; set; }
        public string? AddressCity { get; set; }
        public string? Profission { get; set; }
        public MaritalStatus? MaritalStatus { get; set; }
        public string? SpouseName { get; set; }
        public bool? IsAlive { get; set; }
    }
}
