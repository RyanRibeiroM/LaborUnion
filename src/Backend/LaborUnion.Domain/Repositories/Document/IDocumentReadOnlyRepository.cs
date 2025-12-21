using LaborUnion.Domain.Dtos;

namespace LaborUnion.Domain.Repositories.Document
{
    public interface IDocumentReadOnlyRepository
    {
        Task<Entities.Document?> GetById(int id);
        Task<IList<Entities.Document>> Filter(FilterDocumentDto filters);
        Task<int> CountExpiredDocuments();
        Task<int> CountDocumentsThatExpiredThisMonth();
        Task<IList<Entities.Document>> GetForDashboard();
    }
}
