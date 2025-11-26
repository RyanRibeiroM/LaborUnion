using LaborUnion.Domain.Enums;

namespace LaborUnion.Domain.Dtos
{
    public record FilterUserDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public UserRoles? Role { get; set; }
    }
}
