using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;

namespace LaborUnion.Domain.Repositories.ServiceType
{
    public interface IServiceTypeReadOnlyRepository
    {
        Task<bool> ExistActiveServiceTypeWithName(string name);
        Task<bool> ServiceTypeCanProvidedBySector(int ServiceTypeId, int SectorId);
        Task<Entities.ServiceType?> GetById(int id);
        Task<IList<Entities.ServiceType>> Filter(FilterServiceTypeDto filters);
    }
}
