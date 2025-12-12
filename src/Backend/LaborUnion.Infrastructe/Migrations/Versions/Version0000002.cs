using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.SPOUSE_AND_IS_ALIVE_COLUMNS_IN_THE_FARMER_TABLE, "Adding the columns for spouse's name, spouse's CPF (Brazilian tax ID), and is alive to the farmer table.")]
    public class Version0000002: VersionBase
    {
        public override void Up()
        {
            Alter.Table("Farmers")
                .AddColumn("SpouseName").AsString(200).Nullable()
                .AddColumn("SpouseCpf").AsString(14).Nullable()
                .AddColumn("IsAlive").AsBoolean().NotNullable().WithDefaultValue(true);
        }
    }
}
