using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.ServiceType;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaborUnion.Application.UseCases.ServiceType.Filter
{
    public class FilterServiceTypeUseCase : IFilterServiceTypeUseCase
    {

        private readonly IServiceTypeReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public FilterServiceTypeUseCase(IServiceTypeReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ResponseServicesTypesJson> Execute(RequestFilterServiceTypeJson request)
        {
            var filters = new FilterServiceTypeDto
            {
                Name = request.Name
            };

            var servicesTypes = await _repository.Filter(filters);

            return new ResponseServicesTypesJson
            {
                ServicesTypes = _mapper.Map<IList<ResponseServiceTypeShortJson>>(servicesTypes)
            };
        }
    }
}
