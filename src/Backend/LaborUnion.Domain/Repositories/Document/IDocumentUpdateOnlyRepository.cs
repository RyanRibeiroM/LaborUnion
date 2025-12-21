namespace LaborUnion.Domain.Repositories.Document
{
    public interface IDocumentUpdateOnlyRepository
    {
        Task<Entities.Document?> GetById(int id);
        void Update(Entities.Document document);
    }
}
