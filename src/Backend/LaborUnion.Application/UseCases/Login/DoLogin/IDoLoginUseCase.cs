using LaborUnion.Communication.Responses;
using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.Login.DoLogin
{
    public interface IDoLoginUseCase
    {
        Task<ResponseRegisteredUserJson> Execute(RequestLoginJson request);
    }
}
