using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Sector.Filter
{
    public interface IFilterSectorUseCase
    {
        public Task<ResponseSectorsJson> Execute(RequestFilterSectorJson request);
    }
}
