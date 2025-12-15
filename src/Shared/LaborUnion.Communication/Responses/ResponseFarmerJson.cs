namespace LaborUnion.Communication.Responses
{
    public class ResponseFarmerJson
    {
        public int Id { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string Registration { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? SpouseName { get; set; }
        public string? SpouseCpf { get; set; }
        public DateOnly BirthDate { get; set; }
        public bool IsAlive { get; set; } = true;
        public string AddressNumber { get; set; } = string.Empty;
        public string AddressNeighborhood { get; set; } = string.Empty;
        public string AddressCity { get; set; } = string.Empty;
        public string AddressUf { get; set; } = string.Empty;
        public string AddressCep { get; set; } = string.Empty;
        public string? AddressReference { get; set; }
    }
}
