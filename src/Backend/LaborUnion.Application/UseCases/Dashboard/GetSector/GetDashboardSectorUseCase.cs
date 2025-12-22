using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Services;

namespace LaborUnion.Application.UseCases.Dashboard.GetSector
{
    public class GetDashboardSectorUseCase : IGetDashboardSectorUseCase
    {
        private readonly IServiceReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public GetDashboardSectorUseCase(IServiceReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ResponseChartDatasJson> Execute()
        {
            var countBySector = await _repository.GetCountBySector();

            return new ResponseChartDatasJson
            {
                ChartData = _mapper.Map<IList<ResponseChartDataJson>>(countBySector)
            };

        }
    }
}
