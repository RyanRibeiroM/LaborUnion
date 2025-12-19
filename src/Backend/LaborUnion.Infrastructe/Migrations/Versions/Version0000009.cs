using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.ADD_SERVICE_STATUS, "add service status")]
    public class Version0000009 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("Services")
                .AddColumn("Status").AsInt32().NotNullable();
        }
    }
}
