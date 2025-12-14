namespace LaborUnion.Domain.Repositories.ServiceType
{
    public interface IServiceTypeUpdateOnlyRepository
    {
        Task<Entities.ServiceType?> GetById(int id);
        void Update(Entities.ServiceType serviceType);
    }
}
