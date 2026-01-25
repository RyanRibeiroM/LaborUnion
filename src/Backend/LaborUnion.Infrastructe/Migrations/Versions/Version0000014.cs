using FluentMigrator;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.MAKE_SECTOR_ID_NULLABLE_IN_SERVICE_TYPE, "making the Sector id column nullable in the service type table.")]
    public class Version0000014 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("ServicesTypes")
                .AlterColumn("SectorId").AsInt32().Nullable();
        }
    }
}
