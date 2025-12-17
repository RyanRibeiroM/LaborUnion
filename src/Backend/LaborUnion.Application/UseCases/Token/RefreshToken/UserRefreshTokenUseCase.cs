using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Token;
using LaborUnion.Domain.Security.Tokens;
using LaborUnion.Domain.ValueObjects;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Token.RefreshToken
{
    public class UserRefreshTokenUseCase : IUserRefreshTokenUseCase
    {
        private readonly ITokenRepository _tokenRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccessTokenGenerate _accessTokenGenerator;
        private readonly IRefreshTokenGenerator _refreshTokenGenerator;

        public UserRefreshTokenUseCase(ITokenRepository tokenRepository, IUnitOfWork unitOfWork, IAccessTokenGenerate accessTokenGenerator, IRefreshTokenGenerator refreshTokenGenerator)
        {
            _tokenRepository = tokenRepository;
            _unitOfWork = unitOfWork;
            _accessTokenGenerator = accessTokenGenerator;
            _refreshTokenGenerator = refreshTokenGenerator;
        }
        public async Task<ResponseTokensJson> Execute(RequestNewTokenJson request)
        {
            var refreshToken = await _tokenRepository.Get(request.RefreshToken);

            if (refreshToken is null)
                throw new RefreshTokenNotFoundException();

            var refreshTokenValidUntil = refreshToken.CreatedOn.AddDays(LaborUnionRuleConstants.REFRESH_TOKEN_EXPIRATION_DAYS);
            if (DateTime.Compare(refreshTokenValidUntil, DateTime.UtcNow) < 0)
                throw new RefreshTokenNotFoundException();

            var newRefreshToken = new Domain.Entities.RefreshToken
            {
                Value = _refreshTokenGenerator.Generate(),
                UserId = refreshToken.UserId
            };

            await _tokenRepository.SaveNewRefreshToken(newRefreshToken);

            await _unitOfWork.Commit();

            return new ResponseTokensJson
            {
                AccessToken = _accessTokenGenerator.Generate(refreshToken.User),
                RefreshToken = newRefreshToken.Value
            };

        }
    }
}
