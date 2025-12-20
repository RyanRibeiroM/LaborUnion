using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.Service.Update
{
    public interface IUpdateServiceUseCase
    {
        public Task Execute(int id, RequestUpdateServiceJson request);
    }
}
