using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Repositories.Sector;

namespace LaborUnion.Application.UseCases.Sector.Filter
{
    public class FilterSectorUseCase : IFilterSectorUseCase
    {
        private readonly ISectorReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public FilterSectorUseCase(ISectorReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseSectorsJson> Execute(RequestFilterSectorJson request)
        {
            var filters = new FilterSectorDto
            {
                Name = request.Name,
                UserId = request.UserId
            };

            var sectors = await _repository.Filter(filters);

            return new ResponseSectorsJson
            {
                Sectors = _mapper.Map<IList<ResponseSectorShortJson>>(sectors)
            };
        }
    }
}
