using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.SERVICE_TABLE, "creating the service table")]
    public class Version0000007 : VersionBase
    {
        public override void Up()
        {
            CreateTable("Services")
                .WithColumn("ServiceTypeId").AsInt32().NotNullable().ForeignKey("FK_Service_ServiceType_Id", "ServicesTypes", "Id")
                .WithColumn("FarmerId").AsInt32().NotNullable().ForeignKey("FK_Service_Farmers_Id", "Farmers", "Id")
                .WithColumn("AttendantId").AsInt32().NotNullable().ForeignKey("FK_Service_Users_Id", "Users", "Id")
                .WithColumn("Notes").AsString(3000).Nullable();
        }
    }
}
