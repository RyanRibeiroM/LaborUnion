using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.ServiceType.Update
{
    public interface IUpdateServiceTypeUseCase
    {
        public Task Execute(int id, RequestUpdateServiceTypeJson request);
    }
}
