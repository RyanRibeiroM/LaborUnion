using System.Net;

namespace LaborUnion.Exceptions.ExceptionsBase
{
    public class UnauthorizedAccessException : LaborUnionException
    {
        public UnauthorizedAccessException() : base(string.Empty)
        {
        }

        public override List<string> GetErrorMessages()
        {
            return [ResourceMessagesException.UNAUTHORIZED_ACCESS];
        }

        public override HttpStatusCode GetStatusCode() => HttpStatusCode.Unauthorized;
    }
}
