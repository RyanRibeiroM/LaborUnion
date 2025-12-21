using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Document.Filter
{
    public interface IFilterDocumentUseCase
    {
        public Task<ResponseDocumentsJson> Execute(RequestFilterDocumentJson request);
    }
}
