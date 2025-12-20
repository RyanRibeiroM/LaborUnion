using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;

namespace LaborUnion.Domain.Repositories.Sector
{
    public interface ISectorReadOnlyRepository
    {
        public Task<Entities.Sector?> GetById(int id);
        public Task<bool> ExistActiveSectorWithName(string name);
        public Task<bool> UserHasPermissionInSector(int sectorId, int userId);
        public Task<IList<Entities.Sector>> Filter(FilterSectorDto filters);
        public Task<IList<int>> GetActiveSectorsidsWithUserId(int userId);
    }
}
