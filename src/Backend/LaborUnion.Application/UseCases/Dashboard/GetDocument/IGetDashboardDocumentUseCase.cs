using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.Dashboard.GetDocument
{
    public interface IGetDashboardDocumentUseCase
    {
        public Task<ResponseDocumentsJson> Execute();
    }
}
