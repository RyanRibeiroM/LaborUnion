using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaborUnion.Communication.Responses
{
    public class ResponseRegisteredDocumentJson
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string FarmerName { get; set; } = string.Empty;
    }
}
