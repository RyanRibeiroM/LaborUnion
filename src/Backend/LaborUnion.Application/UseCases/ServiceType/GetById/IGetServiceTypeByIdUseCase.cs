using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.ServiceType.GetById
{
    public interface IGetServiceTypeByIdUseCase
    {
        public Task<ResponseServiceTypeJson> Execute(int id);
    }
}
