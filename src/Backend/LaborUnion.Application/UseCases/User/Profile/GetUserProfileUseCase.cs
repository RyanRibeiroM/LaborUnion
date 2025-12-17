using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Services.LoggedUser;

namespace LaborUnion.Application.UseCases.User.Profile
{
    public class GetUserProfileUseCase : IGetUserProfileUseCase
    {
        private readonly ILoggedUser _loggedUser;
        private readonly IMapper _mapper;

        public GetUserProfileUseCase(ILoggedUser loggedUser, IMapper mapper)
        {
            _loggedUser = loggedUser;
            _mapper = mapper;
        }
        public async Task<ResponseUserProfileJson> Execute()
        {
            var user = await _loggedUser.GetUser();
            return _mapper.Map<ResponseUserProfileJson>(user);
        }

    }
}
