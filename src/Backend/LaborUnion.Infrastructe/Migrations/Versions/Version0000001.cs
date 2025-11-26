using FluentMigrator;
using LaborUnion.Domain.Enums;
using LaborUnion.Infrastructe.Migrations;
using LaborUnion.Infrastructure.Migrations.Versions;

namespace GymManager.Infrastructure.Migrations.Versions
{
    [Migration(DataBaseVersions.TABLE_USER, "Create Students Table and User Table")]
    public class Version0000001 : VersionBase
    {
        public override void Up()
        {

            CreateTable("Users")
                 .WithColumn("Name").AsString(200).NotNullable()
                 .WithColumn("Email").AsString(150).NotNullable()
                 .WithColumn("Password").AsString(2000).NotNullable()
                 .WithColumn("UserIdentifier").AsGuid().NotNullable()
                 .WithColumn("PasswordResetToken").AsString(200).Nullable()
                 .WithColumn("PasswordResetTokenExpires").AsDateTime().Nullable()
                 .WithColumn("Role").AsInt32().NotNullable().WithDefaultValue(UserRoles.Administrator);

            Create.Index("IX_Users_Email")
                  .OnTable("Users")
                  .OnColumn("Email")
                  .Ascending()
                  .WithOptions().Unique();

            Create.Index("IX_Users_UserIdentifier")
                  .OnTable("Users")
                  .OnColumn("UserIdentifier")
                  .Ascending()
                  .WithOptions().Unique();

        }
    }
}
