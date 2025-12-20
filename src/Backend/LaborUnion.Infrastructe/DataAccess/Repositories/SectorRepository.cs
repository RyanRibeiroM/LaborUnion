using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.Sector;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess.Repositories
{
    public class SectorRepository : ISectorReadOnlyRepository, ISectorWriteOnlyRepository, ISectorUpdateOnlyRepository
    {
        private readonly LaborUnionDbContext _dbContext;
        public SectorRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;
        public async Task Add(Sector sector)
        {
            await _dbContext.Sectors.AddAsync(sector);
        }

        public async Task AddUserToSector(SectorUser sectorUser)
        {
            await _dbContext.SectorUsers.AddAsync(sectorUser);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Sectors.FindAsync(id);

            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.Sectors.Update(entity);
            }
        }

        public async Task<bool> ExistActiveSectorWithName(string name)
        {
           return await _dbContext.Sectors.AsNoTracking().AnyAsync(s => s.Name.Equals(name) && s.Active);
        }

        public async Task<IList<Sector>> Filter(FilterSectorDto filters)
        {
            var query = _dbContext.Sectors
                .AsNoTracking()
                .Where(f => f.Active);

            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                query = query.Where(f => f.Name.Contains(filters.Name));
            }

            if (filters.UserId.HasValue)
            {
                query = query.Where(s => s.SectorUsers.Any(su => su.UserId == filters.UserId.Value && su.Active));
            }

            return await query.OrderBy(f => f.Name).ToListAsync();
        }

        public async Task<IList<int>> GetActiveSectorsidsWithUserId(int userId)
        {
            return await _dbContext.SectorUsers
                .AsNoTracking()
                .Where(su => su.UserId == userId && su.Active && su.Sector.Active)
                .Select(su => su.SectorId)
                .ToListAsync();
        }

        public async Task<Sector?> GetById(int id)
        {
            return await _dbContext.Sectors.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }

        public async Task RemoveUserToSector(int sectorId, int userId)
        {
            var entity = await _dbContext.SectorUsers.FirstOrDefaultAsync(su => su.UserId == userId && su.SectorId == sectorId);
            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.SectorUsers.Update(entity);
            }
        }

        public void Update(Sector sector)
        {
            _dbContext.Sectors.Update(sector);
        }

        public async Task<bool> UserHasPermissionInSector(int sectorId, int userId)
        {
            return await _dbContext.SectorUsers.AsNoTracking().AnyAsync(su => su.UserId == userId && su.SectorId == sectorId && su.Active);
        }
    }
}
