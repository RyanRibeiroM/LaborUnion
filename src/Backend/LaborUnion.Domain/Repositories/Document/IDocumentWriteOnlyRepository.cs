namespace LaborUnion.Domain.Repositories.Document
{
    public interface IDocumentWriteOnlyRepository
    {
        Task Add(Entities.Document document);
        Task Delete(int id);
    }
}
