using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Farmer.Register
{
    public interface IRegisterFarmerUseCase
    {
        public Task<ResponseRegisteredFarmerJson> Execute(RequestRegisterFarmerJson request);
    }
}
