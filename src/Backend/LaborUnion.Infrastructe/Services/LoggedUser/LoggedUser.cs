using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Services.LoggedUser;
using Microsoft.AspNetCore.Http;

namespace LaborUnion.Infrastructure.Services.LoggedUser
{
    public class LoggedUser : ILoggedUser
    {
        private readonly IHttpContextAccessor _httpContextAcessor;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;

        public LoggedUser(IHttpContextAccessor httpContextAcessor, IUserReadOnlyRepository userReadOnlyRepository)
        {
            _httpContextAcessor = httpContextAcessor;
            _userReadOnlyRepository = userReadOnlyRepository;
        }
        public async Task<User> GetUser()
        {
            var claim = (_httpContextAcessor.HttpContext?.User.FindFirst("UserIdentifier")) ?? throw new UnauthorizedAccessException();

            var userIdentifier = Guid.Parse(claim.Value);

            var user = await _userReadOnlyRepository.GetByUserIdentifierAsync(userIdentifier);

            return user is null ? throw new UnauthorizedAccessException() : user;
        }
    }
}
