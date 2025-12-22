using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Dashboard.Accountant
{
    public interface IGetDashboardAccountantsUseCase
    {
        public Task<ResponseAccountantsJson> Execute();
    }
}
