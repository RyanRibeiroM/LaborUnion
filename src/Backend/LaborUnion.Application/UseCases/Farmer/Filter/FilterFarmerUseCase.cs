using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Repositories.Farmer;

namespace LaborUnion.Application.UseCases.Farmer.Filter
{
    public class FilterFarmerUseCase : IFilterFarmerUseCase
    {
        private readonly IFarmerReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public FilterFarmerUseCase(IFarmerReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ResponseFarmersJson> Execute(RequestFilterFarmerJson request)
        {
            var filters = new FilterFarmerDto
            {
                Name = request.Name,
                Cpf = request.Cpf,
                Registration = request.Registration,
                AddressCity = request.AddressCity
            };

            var farmers = await _repository.Filter(filters);

            return new ResponseFarmersJson
            {
                Farmers = _mapper.Map<IList<ResponseRegisteredFarmerJson>>(farmers)
            };
        }
    }
}