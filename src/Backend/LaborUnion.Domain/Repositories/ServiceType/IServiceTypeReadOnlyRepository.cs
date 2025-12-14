using LaborUnion.Domain.Dtos;

namespace LaborUnion.Domain.Repositories.ServiceType
{
    public interface IServiceTypeReadOnlyRepository
    {
        Task<bool> ExistActiveServiceTypeWithName(string name);
        Task<Entities.ServiceType?> GetById(int id);
        Task<IList<Entities.ServiceType>> Filter(FilterServiceTypeDto filters);
    }
}
