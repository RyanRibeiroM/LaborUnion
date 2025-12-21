using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.DOCUMENT_TABLE, "Adding the Documents table")]
    public class Version0000012 : VersionBase
    {
        public override void Up()
        {
            CreateTable("Documents")
                .WithColumn("Name").AsString(200).NotNullable()
                .WithColumn("Description").AsString(3000).Nullable()
                .WithColumn("DueDate").AsDate().NotNullable()
                .WithColumn("FarmerId").AsInt32().NotNullable().ForeignKey("FK_Documents_Farmers_Id", "Farmers", "Id");
        }
    }
}
