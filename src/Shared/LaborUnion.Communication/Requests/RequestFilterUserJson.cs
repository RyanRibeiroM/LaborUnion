using LaborUnion.Communication.Enums;

namespace LaborUnion.Communication.Requests
{
    public class RequestFilterUserJson
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public UserRoles? Role { get; set; }
        public int? SectorId { get; set; }
    }
}
