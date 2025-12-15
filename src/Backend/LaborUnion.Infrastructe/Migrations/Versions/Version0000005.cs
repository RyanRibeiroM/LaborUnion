using FluentMigrator;
using LaborUnion.Infrastructure.Migrations.Versions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaborUnion.Infrastructe.Migrations.Versions
{
    [Migration(DataBaseVersions.MAKE_ADDRESS_REFERENCE_NULLABLE, "Make AddressReference nullable")]
    public class Version0000005 : VersionBase
    {
        public override void Up()
        {
            Alter.Table("Farmers")
                .AlterColumn("AddressReference").AsString(350).Nullable();
        }
    }
}
