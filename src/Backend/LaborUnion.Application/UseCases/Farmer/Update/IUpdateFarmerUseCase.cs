using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.Farmer.Update
{
    public interface IUpdateFarmerUseCase
    {
        public Task Execute(int id, RequestRegisterFarmerJson request);
    }
}
