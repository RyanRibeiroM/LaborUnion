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
        public GetUserByIdUseCase(IUserReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseUserJson> Execute(int id)
        {
            var user = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            if(Enum.IsDefined(typeof(PrivilegedUserRoles), (int)user.Role))
                throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            return _mapper.Map<ResponseUserJson>(user);

        }
    }
}
