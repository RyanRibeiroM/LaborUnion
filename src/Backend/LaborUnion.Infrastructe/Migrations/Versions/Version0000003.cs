using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.BIRTH_DATE_COLUMN_IN_THE_FARMER_TABLE, "Adding date of birth to farmer table.")]
    public class Version0000003 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("Farmers")
                .AddColumn("BirthDate").AsDate().NotNullable();
        }
    }
}
