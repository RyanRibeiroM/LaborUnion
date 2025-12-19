using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Service.Register
{
    public class RegisterServiceUseCase : IRegisterServiceUseCase
    {
        public Task<ResponseRegisteredServiceJson> Execute(RequestRegisterServiceJson request)
        {
            throw new NotImplementedException();
        }
    }
}
