using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.User.Profile
{
    public interface IGetUserProfileUseCase
    {
        public Task<ResponseUserProfileJson> Execute();
    }
}
