using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Service.Filter
{
    public interface IFilterServiceUseCase
    {
        public Task<ResponseServicesJson> Execute(RequestFilterServiceJson request);
    }
}
