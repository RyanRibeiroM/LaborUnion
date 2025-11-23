using System.Net;

namespace LaborUnion.Exceptions
{
    public class InvalidLoginException : LaborUnionException
    {
        public InvalidLoginException() : base(string.Empty)
        {
        }

        public override List<string> GetErrorMessages()
        {
            return [ResourceMessagesException.INVALID_LOGIN];
        }

        public override HttpStatusCode GetStatusCode() => HttpStatusCode.Unauthorized;
    }
}
