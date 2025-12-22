using LaborUnion.Domain.Dtos;

namespace LaborUnion.Domain.Repositories.Services
{
    public interface IServiceReadOnlyRepository
    {
        public Task<Entities.Service?> GetById(int id);
        public Task<bool> ExistServiceWithSectorId(int sectorId);
        public Task<bool> ExistServiceWithServiceTypeId(int serviceTypeId);
        Task<int> CountServicesRegisteredInTheLastMonth();
        Task<int> CountServicesRegistered();
        Task<IList<DashboardChartDto>> GetCountBySector();
        Task<IList<DashboardChartDto>> GetCountByServiceType();
        Task<IList<Entities.Service>> Filter(FilterServiceDto filters);
    }
}
