using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Sector.Register
{
    public interface IRegisterSectorUseCase
    {
        public Task<ResponseRegisteredSectorJson> Execute(RequestRegisterSectorJson request);
    }
}
