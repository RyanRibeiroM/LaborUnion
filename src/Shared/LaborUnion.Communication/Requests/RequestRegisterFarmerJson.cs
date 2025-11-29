namespace LaborUnion.Communication.Requests
{
    public class RequestRegisterFarmerJson
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string Registration { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string AddressNumber { get; set; } = string.Empty;
        public string AddressNeighborhood { get; set; } = string.Empty;
        public string AddressCity { get; set; } = string.Empty;
        public string AddressUf { get; set; } = string.Empty;
        public string AddressCep { get; set; } = string.Empty;
        public string AddressReference { get; set; } = string.Empty;
    }
}
