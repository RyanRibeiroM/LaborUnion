using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Service.GetById
{
    public interface IGetServiceByIdUseCase
    {
        public Task<ResponseServiceJson> Execute(int id);
    }
}
