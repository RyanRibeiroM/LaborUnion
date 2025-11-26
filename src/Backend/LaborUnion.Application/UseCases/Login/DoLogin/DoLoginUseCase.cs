using LaborUnion.Communication.Reponses;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Security.Tokens;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Login.DoLogin
{
    public class DoLoginUseCase : IDoLoginUseCase
    {
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IPasswordEncrypter _passwordEncripter;
        private readonly IAccessTokenGenerate _accessTokenGenerate;
        public DoLoginUseCase(IUserReadOnlyRepository userReadOnlyRepository, IPasswordEncrypter passwordEncripter, IAccessTokenGenerate accessTokenGenerate)
        {
            _userReadOnlyRepository = userReadOnlyRepository;
            _passwordEncripter = passwordEncripter;
            _accessTokenGenerate = accessTokenGenerate;
            
        }
        public async Task<ResponseRegisteredUserJson> Execute(RequestLoginJson request)
        {
            var user = await _userReadOnlyRepository.GetByEmailAsync(request.Email);

            if (user is null || !_passwordEncripter.Verify(request.Password, user.Password))
                throw new InvalidLoginException();

            var token = _accessTokenGenerate.Generate(user);

            return new ResponseRegisteredUserJson { 
                Name = user.Name,
                Token = token
            };


        }
    }
}
