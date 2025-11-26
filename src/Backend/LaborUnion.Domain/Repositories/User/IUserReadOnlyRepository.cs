using LaborUnion.Domain.Dtos;

namespace LaborUnion.Domain.Repositories.User
{
    public interface IUserReadOnlyRepository
    {
        Task<bool> ExistWithEmailAsync(string email);
        Task<Entities.User?> GetByEmailAsync(string email);
        Task<Entities.User?> GetByUserIdentifierAsync(Guid userIdentifier);
        Task<List<Entities.User>?> Filter(FilterUserDto filter);
    }
}
