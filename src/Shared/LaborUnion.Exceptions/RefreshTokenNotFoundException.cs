using System.Net;

namespace LaborUnion.Exceptions
{
    public class RefreshTokenNotFoundException : LaborUnionException
    {
        public RefreshTokenNotFoundException() : base(string.Empty)
        {
        }

        public override List<string> GetErrorMessages()
        {
            return [ResourceMessagesException.USER_NOT_FOUND];
        }

        public override HttpStatusCode GetStatusCode() => HttpStatusCode.Unauthorized;
    }
}
