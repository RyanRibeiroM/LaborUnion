using LaborUnion.Domain.Entities;

namespace LaborUnion.Domain.Services.LoggedUser
{
    public interface ILoggedUser
    {
        Task<User> GetUser();
    }
}
