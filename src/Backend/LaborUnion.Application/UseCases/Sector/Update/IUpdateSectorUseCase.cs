using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.Sector.Update
{
    public interface IUpdateSectorUseCase
    {
        public Task Execute(int id, RequestRegisterSectorJson request);
    }
}
