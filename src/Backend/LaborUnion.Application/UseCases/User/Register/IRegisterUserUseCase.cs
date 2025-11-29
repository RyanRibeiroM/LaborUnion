using LaborUnion.Communication.Responses;
using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.User.Register
{
    public interface IRegisterUserUseCase
    {
        Task<ResponseRegisteredUserJson> Execute(RequestRegisterUserJson request);
    }
}
