using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.SERVICE_TYPE_TABLE, "creating the service type table")]
    public class Version0000004 : VersionBase
    {
        public override void Up()
        {
            CreateTable("ServicesTypes")
                 .WithColumn("Name").AsString(250).NotNullable()
                 .WithColumn("Description").AsString(2000).Nullable();

        }
    }
}
