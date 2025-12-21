using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Document.Register
{
    public interface IRegisterDocumentUseCase
    {
        public Task<ResponseRegisteredDocumentJson> Execute(RequestRegisterDocumentJson request); 
    }
}
