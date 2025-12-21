using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Infrastructe.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructure.DataAccess.Repositories
{
    public class UserRepository : IUserReadOnlyRepository, IUserWriteOnlyRepository, IUserUpdateOnlyRepository
    {
        private readonly LaborUnionDbContext _dbContext;

        public UserRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;

        public async Task AddAsync(User user)
        {
            await _dbContext.Users.AddAsync(user);
        }

        public async Task<bool> ExistActiveUserWithEmailAsync(string email)
        {
            return await _dbContext.Users.AnyAsync(user => user.Email.Equals(email) && user.Active);
        }

        public async Task<List<User>?> Filter(FilterUserDto filter)
        {
            var query = _dbContext.Users.AsNoTracking().Where(user => user.Active);

            if (filter.Role.HasValue)
                query = query.Where(user => user.Role.Equals(filter.Role));

            if (!string.IsNullOrEmpty(filter.Name))
                query = query.Where(user => user.Name.Contains(filter.Name));

            if (!string.IsNullOrEmpty(filter.Email))
                query = query.Where(user => user.Email.Contains(filter.Email));

            if (filter.SectorId.HasValue)
            {
                query = query.Where(user => user.SectorUsers.Any(su => su.SectorId == filter.SectorId));
            }

            return await query.ToListAsync();
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email.Equals(email) && user.Active);
        }

        public async Task<User?> GetById(int id)
        {
            return await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id && user.Active);
        }

        async Task<User?> IUserUpdateOnlyRepository.GetById(int id)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id && user.Active);
        }

        public async Task<User?> GetByUserIdentifierAsync(Guid userIdentifier)
        {
            return await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.UserIdentifier == userIdentifier && user.Active);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Users.FindAsync(id);

            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.Users.Update(entity);

            }
        }
        public void Update(User user)
        {
            _dbContext.Users.Update(user);
        }
    }
}
