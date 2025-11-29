using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.Farmer;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess.Repositories
{
    public class FarmerRepository : IFarmerReadOnlyRepository, IFarmerWriteOnlyRepository, IFarmerUpdateOnlyRepository
    {
        private readonly LaborUnionDbContext _dbContext;

        public FarmerRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;

        #region ReadOnly Implementation

        public async Task<bool> ExistActiveFarmerWithCpf(string cpf)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .AnyAsync(f => f.Cpf.Equals(cpf) && f.Active);
        }

        public async Task<bool> ExistActiveFarmerWithRegistration(string registration)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .AnyAsync(f => f.Registration.Equals(registration) && f.Active);
        }

        public async Task<bool> ExistActiveFarmerWithEmail(string email)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .AnyAsync(f => f.Email.Equals(email) && f.Active);
        }

        public async Task<Farmer?> GetById(int id)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Id == id && f.Active);
        }

        public async Task<Farmer?> GetByCpf(string cpf)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .FirstOrDefaultAsync(f => f.Cpf.Equals(cpf) && f.Active);
        }

        public async Task<IList<Farmer>> Filter(FilterFarmerDto filters)
        {
            var query = _dbContext.Farmers
                .AsNoTracking()
                .Where(f => f.Active);

            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                query = query.Where(f => f.Name.Contains(filters.Name));
            }

            if (!string.IsNullOrWhiteSpace(filters.Cpf))
            {
                query = query.Where(f => f.Cpf.Equals(filters.Cpf));
            }

            if (!string.IsNullOrWhiteSpace(filters.Registration))
            {
                query = query.Where(f => f.Registration.Equals(filters.Registration));
            }

            if (!string.IsNullOrWhiteSpace(filters.AddressCity))
            {
                query = query.Where(f => f.AddressCity.Contains(filters.AddressCity));
            }

            return await query.OrderBy(f => f.Name).ToListAsync();
        }

        public async Task<int> CountTotalFarmers()
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .CountAsync(f => f.Active);
        }

        public async Task<int> CountFarmersByCity(string city)
        {
            return await _dbContext.Farmers
                .AsNoTracking()
                .CountAsync(f => f.Active && f.AddressCity.Equals(city));
        }

        public async Task<int> CountFarmersRegisteredInTheLastMonth()
        {
            var lastMonth = DateTime.UtcNow.AddDays(-30);

            return await _dbContext.Farmers
                .AsNoTracking()
                .CountAsync(f => f.Active && f.CreatedOn >= lastMonth);
        }

        #endregion

        #region WriteOnly Implementation

        public async Task Add(Farmer farmer)
        {
            await _dbContext.Farmers.AddAsync(farmer);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Farmers.FindAsync(id);

            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.Farmers.Update(entity);

            }
        }

        #endregion

        #region UpdateOnly Implementation

        async Task<Farmer?> IFarmerUpdateOnlyRepository.GetById(int id)
        {
            return await _dbContext.Farmers
                .FirstOrDefaultAsync(f => f.Id == id && f.Active);
        }

        public void Update(Farmer farmer)
        {
            _dbContext.Farmers.Update(farmer);
        }

        #endregion
    }
}
