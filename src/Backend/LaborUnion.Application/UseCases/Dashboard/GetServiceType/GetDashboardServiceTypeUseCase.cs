using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Services;

namespace LaborUnion.Application.UseCases.Dashboard.GetServiceType
{
    public class GetDashboardServiceTypeUseCase : IGetDashboardServiceTypeUseCase
    {
        private readonly IServiceReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public GetDashboardServiceTypeUseCase(IServiceReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ResponseChartDatasJson> Execute()
        {
            var countByServiceType = await _repository.GetCountByServiceType();

            return new ResponseChartDatasJson
            {
                ChartData = _mapper.Map<IList<ResponseChartDataJson>>(countByServiceType)
            };

        }
    }
}
