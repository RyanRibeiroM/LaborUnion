using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Farmer.GetById
{
    public interface IGetFarmerByIdUseCase
    {
        public Task<ResponseFarmerJson> Execute(int id);
    }
}
