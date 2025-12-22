using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Dashboard.GetSector
{
    public interface IGetDashboardSectorUseCase
    {
        public Task<ResponseChartDatasJson> Execute();
    }
}
