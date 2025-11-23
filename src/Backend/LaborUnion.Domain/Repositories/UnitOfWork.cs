namespace LaborUnion.Domain.Repositories
{
    public interface UnitOfWork
    {
        public Task Commit();
    }
}
