using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories.User;

namespace LaborUnion.Application.UseCases.User.Filter
{
    public class FilterUserUseCase : IFilterUserUseCase
    {
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IMapper _mapper;
        public FilterUserUseCase(IUserReadOnlyRepository userReadOnlyRepository, IMapper mapper)
        {
            _userReadOnlyRepository = userReadOnlyRepository;
            _mapper = mapper;
        }
        public async Task<ResponseUsersJson> Execute(RequestFilterUserJson request)
        {
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

            var filteredUsers = users
                .Where(user => !Enum.IsDefined(typeof(PrivilegedUserRoles), (int)user.Role))
                .ToList();

            return new ResponseUsersJson() { 
                Users = _mapper.Map<IList<ResponseUserShortJson>>(filteredUsers)
            };


        }
    }
}
