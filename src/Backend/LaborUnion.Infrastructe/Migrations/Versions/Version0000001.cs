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


            CreateTable("Farmers")
                .WithColumn("Name").AsString(200).NotNullable()
                .WithColumn("Email").AsString(150).Nullable()
                .WithColumn("Cpf").AsString(14).NotNullable()
                .WithColumn("Registration").AsString(50).NotNullable()
                .WithColumn("Phone").AsString(20).Nullable()
                .WithColumn("AddressNumber").AsString(20).NotNullable()
                .WithColumn("AddressNeighborhood").AsString(100).NotNullable()
                .WithColumn("AddressCity").AsString(100).NotNullable()
                .WithColumn("AddressUf").AsString(2).NotNullable()
                .WithColumn("AddressCep").AsString(10).NotNullable()
                .WithColumn("AddressReference").AsString(200).NotNullable()

                .WithColumn("RegisteredBy").AsInt32().NotNullable()
                    .ForeignKey("FK_Farmers_Users", "Users", "Id");

            Create.Index("IX_Farmers_Cpf")
                .OnTable("Farmers")
                .OnColumn("Cpf")
                .Ascending()
                .WithOptions().Unique();

            Create.Index("IX_Farmers_Registration")
                .OnTable("Farmers")
                .OnColumn("Registration")
                .Ascending()
                .WithOptions().Unique();

        }
    }
}
