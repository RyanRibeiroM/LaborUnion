using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.Services;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess.Repositories
{
    public class ServiceRepository : IServiceReadOnlyRepository, IServiceWriteOnlyRepository, IServiceUpdateOnlyRepository
    {
        private readonly LaborUnionDbContext _dbContext;

        public ServiceRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;
        public async Task Add(Service service)
        {
            await _dbContext.Services.AddAsync(service);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Services.FindAsync(id);
            if(entity is not null)
            {
                entity.Active = false;
                _dbContext.Services.Update(entity);
            }
        }

        public async Task<bool> ExistServiceWithSectorId(int sectorId)
        {
            return await _dbContext.Services.AnyAsync(s => s.SectorId == sectorId && s.Active);
        }

        public async Task<Service?> GetById(int id)
        {
            return await _dbContext.Services
                .Include(s => s.ServiceType)
                .Include(s => s.Farmer)
                .Include(s => s.Attendant)
                .Include(s => s.Sector)
                .FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }

        public void Update(Service service)
        {
            _dbContext.Services.Update(service);
        }

        async Task<Service?> IServiceUpdateOnlyRepository.GetById(int id)
        {
            return await _dbContext.Services.FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }
    }
}
