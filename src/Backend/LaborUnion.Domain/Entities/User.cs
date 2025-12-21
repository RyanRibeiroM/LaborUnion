using LaborUnion.Domain.Enums;
namespace LaborUnion.Domain.Entities
{
    public class User :  EntityBase
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public Guid UserIdentifier { get; set; } = Guid.NewGuid();
        public UserRoles Role { get; set; }
        public virtual ICollection<SectorUser> SectorUsers { get; set; } = new List<SectorUser>();
    }
}
