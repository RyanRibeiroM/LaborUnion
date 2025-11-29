using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Farmer.Filter
{
    public interface IFilterFarmerUseCase
    {
        Task<ResponseFarmersJson> Execute(RequestFilterFarmerJson request);
    }
}
