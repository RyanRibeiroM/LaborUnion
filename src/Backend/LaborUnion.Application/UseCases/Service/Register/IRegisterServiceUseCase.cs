using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Service.Register
{
    public interface IRegisterServiceUseCase
    {
        public Task<ResponseRegisteredServiceJson> Execute(RequestRegisterServiceJson request);
    }
}
