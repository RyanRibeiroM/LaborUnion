using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Services.LoggedUser;

namespace LaborUnion.Application.UseCases.User.Filter
{
    public class FilterUserUseCase : IFilterUserUseCase
    {
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IMapper _mapper;
        private readonly ILoggedUser _loggedUser;
        public FilterUserUseCase(IUserReadOnlyRepository userReadOnlyRepository, IMapper mapper, ILoggedUser loggedUser)
        {
            _userReadOnlyRepository = userReadOnlyRepository;
            _mapper = mapper;
            _loggedUser = loggedUser;
        }
        public async Task<ResponseUsersJson> Execute(RequestFilterUserJson request)
        {
            var loggedUser = await _loggedUser.GetUser();
            var filter = new FilterUserDto() { 
                Name = request.Name,
                Email = request.Email,
                Role = (UserRoles?)request.Role,
                SectorId = request.SectorId
            };

            var users = await _userReadOnlyRepository.Filter(filter);

            if (users is null)
            {
                return new ResponseUsersJson { Users = new List<ResponseUserShortJson>() };
            }

            var filteredUsers = users;
            if (loggedUser.Role == UserRoles.Developer)
            {
                filteredUsers = [.. users.Where(user => user.Role != UserRoles.Developer)];
            }
            else
            {
                 filteredUsers = [.. users.Where(user => !Enum.IsDefined(typeof(PrivilegedUserRoles), (int)user.Role))];
            }

            return new ResponseUsersJson()
            {
                Users = _mapper.Map<IList<ResponseUserShortJson>>(filteredUsers)
            };
        }
    }
}
