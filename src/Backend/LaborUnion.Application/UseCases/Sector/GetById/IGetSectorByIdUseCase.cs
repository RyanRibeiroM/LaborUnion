using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Sector.GetById
{
    public interface IGetSectorByIdUseCase
    {
        public Task<ResponseSectorJson> Execute(int id);
    }
}
