namespace LaborUnion.Domain.Repositories.Services
{
    public interface IServiceWriteOnlyRepository
    {
        Task Add(Entities.Service service);
        Task Delete(int id);
    }
}
