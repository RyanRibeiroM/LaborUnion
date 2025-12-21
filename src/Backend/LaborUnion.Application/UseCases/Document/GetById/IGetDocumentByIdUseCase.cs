using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Document.GetById
{
    public interface IGetDocumentByIdUseCase
    {
        public Task<ResponseDocumentJson> Execute(int id);
    }
}
