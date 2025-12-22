using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Dashboard.GetServiceType
{
    public interface IGetDashboardServiceTypeUseCase
    {
        public Task<ResponseChartDatasJson> Execute();
    }
}
