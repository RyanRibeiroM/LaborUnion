using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Sector.AddUser
{
    public interface IRegisterUserToSectorUseCase
    {
        public Task<ResponseRegisteredSectorUserJson> Execute(int sectorId, RequestRegisterUserToSectorJson request);
    }
}
