using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.ServiceType;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess.Repositories
{
    public class ServiceTypeRepository : IServiceTypeReadOnlyRepository, IServiceTypeWriteOnlyRepository, IServiceTypeUpdateOnlyRepository
    {
        private readonly LaborUnionDbContext _dbContext;

        public ServiceTypeRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;
        public async Task Add(ServiceType serviceType)
        {
            await _dbContext.ServicesTypes.AddAsync(serviceType);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.ServicesTypes.FindAsync(id);

            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.ServicesTypes.Update(entity);
            }
        }

        public async Task<bool> ExistActiveServiceTypeWithName(string name)
        {
            return await _dbContext.ServicesTypes
                .AsNoTracking()
                .AnyAsync(s => s.Name.Equals(name) && s.Active);
        }

        public async Task<IList<ServiceType>> Filter(FilterServiceTypeDto filters)
        {
            var query = _dbContext.ServicesTypes
                .AsNoTracking()
                .Where(s => s.Active);

            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                query = query.Where(s => s.Name.Contains(filters.Name));
            }

            if (filters.SectorId.HasValue)
            {
                query = query.Where(s => s.SectorId == filters.SectorId.Value);
            }

            return await query.OrderBy(s => s.Name).ToListAsync();
        }

        public async Task<ServiceType?> GetById(int id)
        {
            return await _dbContext.ServicesTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }

        public async Task<bool> ServiceTypeCanProvidedBySector(int ServiceTypeId, int SectorId)
        {
            return await _dbContext.ServicesTypes
                .AsNoTracking()
                .AnyAsync(s => s.Id == ServiceTypeId && s.SectorId == SectorId && s.Active);
        }

        public void Update(ServiceType serviceType)
        {
            _dbContext.ServicesTypes.Update(serviceType);
        }

        async Task<ServiceType?> IServiceTypeUpdateOnlyRepository.GetById(int id)
        {
            return await _dbContext.ServicesTypes
                .FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }
    }
}
