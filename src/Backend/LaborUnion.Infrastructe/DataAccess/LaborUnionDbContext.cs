using LaborUnion.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace LaborUnion.Infrastructe.DataAccess
{
    public class LaborUnionDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditConcepts();
            return base.SaveChangesAsync(cancellationToken);
        }
        public override int SaveChanges()
        {
            ApplyAuditConcepts();
            return base.SaveChanges();
        }

        private void ApplyAuditConcepts()
        {
            var entries = ChangeTracker.Entries<EntityBase>()
                .Where(e => e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                entry.Entity.UpdatedOn = DateTime.UtcNow;
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(LaborUnionDbContext).Assembly);
        }
    }
}
