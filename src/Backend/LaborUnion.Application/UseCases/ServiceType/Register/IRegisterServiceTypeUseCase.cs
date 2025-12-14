using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.ServiceType.Resgister
{
    public interface IRegisterServiceTypeUseCase
    {
        public Task<ResponseRegisteredServiceTypeJson> Execute(RequestRegisterServiceTypeJson request);
    }
}
