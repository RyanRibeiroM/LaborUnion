namespace LaborUnion.Domain.Repositories.User
{
    public interface IUserWriteOnlyRepository
    {
        Task AddAsync(Entities.User user);
        Task Delete(int id);
    }
}
