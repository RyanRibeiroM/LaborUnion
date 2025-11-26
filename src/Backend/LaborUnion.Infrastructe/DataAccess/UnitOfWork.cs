using LaborUnion.Domain.Repositories;
using LaborUnion.Infrastructe.DataAccess;

namespace LaborUnion.Infrastructure.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {
        public readonly LaborUnionDbContext _context;
        public UnitOfWork(LaborUnionDbContext context) => _context = context;

        public async Task Commit()
        {
            await _context.SaveChangesAsync();
        }
    }
}
