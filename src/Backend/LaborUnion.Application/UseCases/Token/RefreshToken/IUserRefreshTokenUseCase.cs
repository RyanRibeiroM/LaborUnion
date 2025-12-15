using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Token.RefreshToken
{
    public interface IUserRefreshTokenUseCase
    {
        public Task<ResponseTokensJson> Execute(RequestNewTokenJson request);
    }
}
