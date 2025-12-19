using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.ADD_SECTOR_ID_IN_THE_SERVICE_TYPE_TABLE, "Adding the Sector id column to the service type table.")]
    public class Version0000011 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("ServicesTypes")
                .AddColumn("SectorId").AsInt32().NotNullable().ForeignKey("FK_ServicesTypes_Sectors_Id", "Sectors", "Id");
        }
    }
}
