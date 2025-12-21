using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.Document.Update
{
    public interface IUpdateDocumentUseCase
    {
        public Task Execute(int id, RequestUpdateDocumentJson request);
    }
}
