using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.SECTOR_TABLE, "Create Sector and SectorUser tables")]
    public class Version0000010 : VersionBase
    {
        public override void Up()
        {
            CreateTable("Sectors")
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("Description").AsString(500).Nullable();

            CreateTable("SectorUsers")
                .WithColumn("SectorId").AsInt32().NotNullable().ForeignKey("FK_SectorUser_Sector", "Sectors", "Id")
                .WithColumn("UserId").AsInt32().NotNullable().ForeignKey("FK_SectorUser_User", "Users", "Id");

            Alter.Table("Services")
                .AddColumn("SectorId").AsInt32().Nullable().ForeignKey("FK_Services_Sector", "Sectors", "Id");
        }
    }
}
