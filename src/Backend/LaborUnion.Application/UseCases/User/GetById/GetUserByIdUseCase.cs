using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.User.GetById
{
    public class GetUserByIdUseCase : IGetUserByIdUseCase
    {
        private readonly IUserReadOnlyRepository _repository;
        private readonly IMapper _mapper;
        private readonly ILoggedUser _loggedUser;
        public GetUserByIdUseCase(IUserReadOnlyRepository repository, IMapper mapper, ILoggedUser loggedUser)
        {
            _repository = repository;
            _mapper = mapper;
            _loggedUser = loggedUser;
        }
        public async Task<ResponseUserJson> Execute(int id)
        {
            var loggedUser = await _loggedUser.GetUser();
            var user = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            if(user.Role == UserRoles.Developer)
                throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);
            else if (Enum.IsDefined(typeof(PrivilegedUserRoles), (int)user.Role) && loggedUser.Role == UserRoles.Administrator)
                throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            return _mapper.Map<ResponseUserJson>(user);

        }
    }
}
