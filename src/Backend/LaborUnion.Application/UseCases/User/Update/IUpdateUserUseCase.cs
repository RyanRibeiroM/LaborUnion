using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.User.Update
{
    public interface IUpdateUserUseCase
    {
        public Task Execute(int id, RequestRegisterUserJson request);
    }
}
