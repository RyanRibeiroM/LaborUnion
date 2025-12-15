using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.ServiceType.Filter
{
    public interface IFilterServiceTypeUseCase
    {
        public Task<ResponseServicesTypesJson> Execute(RequestFilterServiceTypeJson request);
    }
}
