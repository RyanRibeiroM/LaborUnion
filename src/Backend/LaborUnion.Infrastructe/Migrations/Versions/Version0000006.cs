using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.REFRESH_TOKEN_TABLE, "Create table to save the refresh token")]
    public class Version0000006 : VersionBase
    {
        public override void Up()
        {
            CreateTable("RefreshTokens")
                .WithColumn("Value").AsString().NotNullable()
                .WithColumn("UserId").AsInt32().NotNullable().ForeignKey("FK_RefreshToken_User_Id", "Users", "Id");
        }
    }
}
