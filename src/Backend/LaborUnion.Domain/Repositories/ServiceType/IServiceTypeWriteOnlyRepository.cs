namespace LaborUnion.Domain.Repositories.ServiceType
{
    public interface IServiceTypeWriteOnlyRepository
    {
        Task Add(Entities.ServiceType serviceType);
        Task Delete(int id);
    }
}
