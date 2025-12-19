using LaborUnion.Domain.Entities;

namespace LaborUnion.Domain.Repositories.Sector
{
    public interface ISectorWriteOnlyRepository
    {
        public Task Add(Entities.Sector sector);
        public Task Delete(int id);
        public Task AddUserToSector(SectorUser sectorUser);
        public Task RemoveUserToSector(int sectorId, int userId);
    }
}
