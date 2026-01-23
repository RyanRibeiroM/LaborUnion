using FluentMigrator;
using LaborUnion.Domain.Enums;
using LaborUnion.Infrastructure.Migrations.Versions;
using Microsoft.Extensions.Configuration;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.ADD_DEFAULT_USER, "Add default user")]
    public class Version0000013 : VersionBase
    {
        private readonly IConfiguration _configuration;

        public Version0000013(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public override void Up()
        {
            Insert.IntoTable("Users").Row(new
            {
                CreatedOn = DateTime.UtcNow,
                UpdatedOn = DateTime.UtcNow,
                Active = true,
                Name = _configuration.GetSection("DevUser:Name").Value,
                Email = _configuration.GetSection("DevUser:Email").Value,
                Password = BCrypt.Net.BCrypt.HashPassword(_configuration.GetSection("DevUser:Password").Value),
                UserIdentifier = Guid.NewGuid(),
                Role = (int)UserRoles.Developer
            });
        }
    }
}
