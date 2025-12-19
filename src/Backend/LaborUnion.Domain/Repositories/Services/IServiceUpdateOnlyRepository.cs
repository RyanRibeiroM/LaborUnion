namespace LaborUnion.Domain.Repositories.Services
{
    public interface IServiceUpdateOnlyRepository
    {
        Task<Entities.Service?> GetById(int id);
        void Update(Entities.Service service);
    }
}
