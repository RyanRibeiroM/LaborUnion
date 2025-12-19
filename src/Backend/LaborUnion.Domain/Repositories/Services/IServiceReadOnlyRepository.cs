namespace LaborUnion.Domain.Repositories.Services
{
    public interface IServiceReadOnlyRepository
    {
        public Task<Entities.Service?> GetById(int id);
        public Task<bool> ExistServiceWithSectorId(int sectorId);

    }
}
