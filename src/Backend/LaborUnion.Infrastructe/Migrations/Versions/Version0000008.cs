using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.ADD_MARITAL_STATUS_AND_OCCUPATION_TO_THE_FARMERS_TABLE, "Adding marital status and profession to the farmer table.")]
    public class Version0000008 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("Farmers")
                .AddColumn("MaritalStatus").AsInt32().NotNullable()
                .AddColumn("Profession").AsString(150).NotNullable();
        }
    }
}
