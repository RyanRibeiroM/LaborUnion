namespace LaborUnion.Application.UseCases.Document.Delete
{
    public interface IDeleteDocumentUseCase
    {
        public Task Execute(int id);
    }
}
