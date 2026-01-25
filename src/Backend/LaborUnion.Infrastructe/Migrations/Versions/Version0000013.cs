using FluentMigrator;
using LaborUnion.Domain.Enums;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.ADD_DEFAULT_USER, "Add default user")]
    public class Version0000013 : VersionBase
    {
        public override void Up()
        {
            Insert.IntoTable("Users").Row(new
            {
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                Active = true,
                Name = "Super system administrator",
                Email = "superadmin123@gmail.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Ecno524@cd"),
                UserIdentifier = Guid.NewGuid(),
                Role = (int)UserRoles.Developer
            });
        }
    }
}
