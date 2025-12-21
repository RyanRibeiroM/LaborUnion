using LaborUnion.Communication.Enums;

namespace LaborUnion.Communication.Requests
{
    public class RequestUpdateUserJson
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Password { get; set; }
        public UserRoles Role { get; set; }
    }
}
