using System.Net;

namespace LaborUnion.Exceptions
{
    public abstract class LaborUnionException(string message) : SystemException(message)
    {
        public abstract HttpStatusCode GetStatusCode();
        public abstract List<string> GetErrorMessages();
    }
}
