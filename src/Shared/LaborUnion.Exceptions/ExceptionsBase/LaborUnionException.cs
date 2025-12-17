using System.Net;

namespace LaborUnion.Exceptions.ExceptionsBase
{
    public abstract class LaborUnionException(string message) : SystemException(message)
    {
        public abstract HttpStatusCode GetStatusCode();
        public abstract List<string> GetErrorMessages();
    }
}
