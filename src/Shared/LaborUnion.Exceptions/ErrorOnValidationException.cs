using System.Net;

namespace LaborUnion.Exceptions
{
    public class ErrorOnValidationException(List<string> errors) : LaborUnionException(string.Empty)
    {
        private readonly List<string> _errors = errors;

        public override HttpStatusCode GetStatusCode() => HttpStatusCode.BadRequest;

        public override List<string> GetErrorMessages() => _errors;

    }
}
