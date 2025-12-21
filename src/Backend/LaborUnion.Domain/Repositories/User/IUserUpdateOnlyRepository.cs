namespace LaborUnion.Domain.Repositories.User
{
    public interface IUserUpdateOnlyRepository
    {
        public Task<Entities.User?> GetById(int id);
        public void Update(Entities.User user);
    }
}
