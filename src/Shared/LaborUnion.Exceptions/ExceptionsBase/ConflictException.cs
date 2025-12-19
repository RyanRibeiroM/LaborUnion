using System.Net;

namespace LaborUnion.Exceptions.ExceptionsBase
{
    public class ConflictException(string error) : LaborUnionException(string.Empty)
    {
        private readonly string _error = error;
        public override List<string> GetErrorMessages() => [_error];
        public override HttpStatusCode GetStatusCode() => HttpStatusCode.Conflict;
    }
}
