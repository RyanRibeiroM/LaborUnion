using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.User.UpdateProfile
{
    public interface IUpdateUserProfileUseCase
    {
        public Task Execute(RequestUpdateUserProfileJson request);
    }
}
