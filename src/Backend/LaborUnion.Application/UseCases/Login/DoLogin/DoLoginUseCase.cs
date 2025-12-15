using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Token;
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
        private readonly IRefreshTokenGenerator _refreshTokenGenerator;
        private readonly ITokenRepository _tokenRepository;
        private readonly IUnitOfWork _unitOfWork;
        public DoLoginUseCase(IUserReadOnlyRepository userReadOnlyRepository, IPasswordEncrypter passwordEncripter, IAccessTokenGenerate accessTokenGenerate, IRefreshTokenGenerator refreshTokenGenerator,
            ITokenRepository tokenRepository, IUnitOfWork unitOfWork)
        {
            _userReadOnlyRepository = userReadOnlyRepository;
            _passwordEncripter = passwordEncripter;
            _accessTokenGenerate = accessTokenGenerate;
            _refreshTokenGenerator = refreshTokenGenerator;
            _tokenRepository = tokenRepository;
            _unitOfWork = unitOfWork;

        }
        public async Task<ResponseRegisteredUserJson> Execute(RequestLoginJson request)
        {
            var user = await _userReadOnlyRepository.GetByEmailAsync(request.Email);

            if (user is null || !_passwordEncripter.Verify(request.Password, user.Password))
                throw new InvalidLoginException();

            var token = _accessTokenGenerate.Generate(user);
            var refreshToken = await CreateAndSaveRefreshToken(user);

            return new ResponseRegisteredUserJson { 
                Name = user.Name,
                Tokens = new ResponseTokensJson { 
                    AccessToken = token,
                    RefreshToken = refreshToken,
                }

            };
        }

        public async Task<string> CreateAndSaveRefreshToken(Domain.Entities.User usuario)
        {
            var refreshToken = new Domain.Entities.RefreshToken
            {
                Value = _refreshTokenGenerator.Generate(),
                UserId = usuario.Id
            };

            await _tokenRepository.SaveNewRefreshToken(refreshToken);

            await _unitOfWork.Commit();

            return refreshToken.Value;

        }
    }
}
