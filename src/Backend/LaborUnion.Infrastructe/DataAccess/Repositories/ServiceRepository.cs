using LaborUnion.Domain.Dtos;
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

        public async Task<int> CountServicesRegistered()
        {
            return await _dbContext.Services.AsNoTracking().Where(s => s.Active).CountAsync();
        }

        public async Task<int> CountServicesRegisteredInTheLastMonth()
        {
            var lastMonth = DateTime.UtcNow.AddDays(-30);

            return await _dbContext.Services
                .AsNoTracking()
                .CountAsync(f => f.Active && f.CreatedOn >= lastMonth);
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

        public async Task<bool> ExistServiceWithServiceTypeId(int serviceTypeId)
        {
            return await _dbContext.Services.AnyAsync(s => s.ServiceTypeId == serviceTypeId && s.Active);
        }

        public async Task<IList<Service>> Filter(FilterServiceDto filters)
        {
            var query = _dbContext.Services
                .AsNoTracking()
                .Include(s => s.ServiceType)
                .Include(s => s.Farmer)
                .Include(s => s.Attendant)
                .Include(s => s.Sector)
                .Where(s => s.Active);

            if (filters.FarmerId.HasValue)
            {
                query = query.Where(s => s.FarmerId == filters.FarmerId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.FarmerName))
            {
                query = query.Where(s => s.Farmer.Name.Contains(filters.FarmerName));
            }

            if (!string.IsNullOrWhiteSpace(filters.FarmerCpf))
            {
                query = query.Where(s => s.Farmer.Cpf.Contains(filters.FarmerCpf));
            }

            if (filters.ServiceDate.HasValue)
            {
                var dateToFilter = filters.ServiceDate.Value.ToDateTime(TimeOnly.MinValue);
                var nextDay = dateToFilter.AddDays(1);

                query = query.Where(s => s.CreatedOn >= dateToFilter && s.CreatedOn < nextDay);
            }

            if (filters.AttendantId.HasValue)
            {
                query = query.Where(s => s.AttendantId == filters.AttendantId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.AttendantName))
            {
                query = query.Where(s => s.Attendant.Name.Contains(filters.AttendantName));
            }

            if (filters.Status.HasValue)
            {
                query = query.Where(s => s.Status == filters.Status.Value);
            }

            if (filters.ServiceTypeId.HasValue)
            {
                query = query.Where(s => s.ServiceTypeId == filters.ServiceTypeId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.ServiceTypeName))
            {
                query = query.Where(s => s.ServiceType.Name.Contains(filters.ServiceTypeName));
            }

            if (filters.SectorId.HasValue)
            {
                query = query.Where(s => s.SectorId == filters.SectorId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.SectorName))
            {
                query = query.Where(s => s.Sector.Name.Contains(filters.SectorName));
            }

            query = query.OrderByDescending(s => s.CreatedOn);

            return await query.ToListAsync();
        }

        public async Task<Service?> GetById(int id)
        {
            return await _dbContext.Services
                .AsNoTracking()
                .Include(s => s.ServiceType)
                .Include(s => s.Farmer)
                .Include(s => s.Attendant)
                .Include(s => s.Sector)
                .FirstOrDefaultAsync(s => s.Id == id && s.Active);
        }

        public async Task<IList<DashboardChartDto>> GetCountBySector()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var startOfYear = new DateTime(today.Year, 1, 1);

            return await _dbContext.Services
                .AsNoTracking()
                .Where(s => s.Active)
                .GroupBy(s => new { s.Sector.Id, s.Sector.Name })
                .Select(g => new DashboardChartDto
                {
                    Id = g.Key.Id,
                    Name = g.Key.Name,
                    AllCount = g.Count(),
                    MonthCount = g.Count(s => s.CreatedOn >= startOfMonth),
                    YearCount = g.Count(s => s.CreatedOn >= startOfYear)

                })
                .OrderByDescending(x => x.AllCount)
                .ToListAsync();
        }

        public async Task<IList<DashboardChartDto>> GetCountByServiceType()
        {
            var today = DateTime.Today;
            var startOfMonth = new DateTime(today.Year, today.Month, 1);
            var startOfYear = new DateTime(today.Year, 1, 1);

            return await _dbContext.Services
                .AsNoTracking()
                .Where(s => s.Active)
                .GroupBy(s => new { s.ServiceType.Id, s.ServiceType.Name })
                .Select(g => new DashboardChartDto
                {
                    Id = g.Key.Id,
                    Name = g.Key.Name,
                    AllCount = g.Count(),
                    MonthCount = g.Count(s => s.CreatedOn >= startOfMonth),
                    YearCount = g.Count(s => s.CreatedOn >= startOfYear)
                })
                .OrderByDescending(x => x.AllCount)
                .ToListAsync();
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
