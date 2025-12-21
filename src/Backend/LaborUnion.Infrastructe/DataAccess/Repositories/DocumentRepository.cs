using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.Document;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess.Repositories
{
    public class DocumentRepository : IDocumentReadOnlyRepository, IDocumentWriteOnlyRepository, IDocumentUpdateOnlyRepository
    {

        private readonly LaborUnionDbContext _dbContext;

        public DocumentRepository(LaborUnionDbContext dbContext) => _dbContext = dbContext;
        public async Task Add(Document document)
        {
            await _dbContext.Documents.AddAsync(document);
        }

        public async Task<int> CountDocumentsThatExpiredThisMonth()
        {
            var lastMonth = DateOnly.FromDateTime(DateTime.Today.AddDays(-30));

            return await _dbContext.Documents
                .AsNoTracking()
                .CountAsync(f => f.Active && f.DueDate >= lastMonth);
        }

        public async Task<int> CountExpiredDocuments()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await _dbContext.Documents
                .AsNoTracking()
                .CountAsync(f => f.Active && f.DueDate <= today);
        }

        public async Task Delete(int id)
        {
            var entity = await _dbContext.Documents.FindAsync(id);

            if (entity is not null)
            {
                entity.Active = false;
                _dbContext.Documents.Update(entity);

            }
        }

        public async Task<IList<Document>> Filter(FilterDocumentDto filters)
        {
            var query = _dbContext.Documents
                .AsNoTracking()
                .Include(d => d.Farmer)
                .Where(d => d.Active);

            if (!string.IsNullOrWhiteSpace(filters.Name))
            {
                query = query.Where(d => d.Name.Contains(filters.Name));
            }

            if (filters.FarmerId.HasValue)
            {
                query = query.Where(d => d.FarmerId == filters.FarmerId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filters.FarmerName))
            {
                query = query.Where(d => d.Farmer.Name.Contains(filters.FarmerName));
            }

            if (filters.CreatedOn.HasValue)
            {
                var filterDate = filters.CreatedOn.Value.ToDateTime(TimeOnly.MinValue);

                query = query.Where(d => d.CreatedOn.Date == filterDate.Date);
            }

            if (filters.DueDate.HasValue)
            {
                query = query.Where(d => d.DueDate == filters.DueDate.Value);
            }

            if (filters.IsExpired.HasValue)
            {
                var today = DateOnly.FromDateTime(DateTime.Today);

                if (filters.IsExpired.Value)
                {
                    query = query.Where(d => d.DueDate < today);
                }
                else
                {
                    query = query.Where(d => d.DueDate >= today);
                }
            }

            query = query.OrderBy(d => d.DueDate);

            return await query.ToListAsync();
        }

        public async Task<Document?> GetById(int id)
        {
            return await _dbContext.Documents
                .AsNoTracking()
                .Include(d => d.Farmer)
                .FirstOrDefaultAsync(f => f.Id == id && f.Active);
        }

        async Task<Document?> IDocumentUpdateOnlyRepository.GetById(int id)
        {
            return await _dbContext.Documents
                .FirstOrDefaultAsync(f => f.Id == id && f.Active);
        }
        public async Task<IList<Document>> GetForDashboard()
        {
            return await _dbContext
            .Documents
            .AsNoTracking()
            .Include(d => d.Farmer)
            .Where(d => d.Active)
            .OrderBy(r => r.DueDate)
            .Take(5)
            .ToListAsync();
        }

        public void Update(Document document)
        {
            _dbContext.Documents.Update(document);
        }
    }
}
