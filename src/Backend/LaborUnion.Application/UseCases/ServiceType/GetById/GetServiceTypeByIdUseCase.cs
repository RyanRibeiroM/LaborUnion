using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.ServiceType.GetById
{
    public class GetServiceTypeByIdUseCase : IGetServiceTypeByIdUseCase
    {
        private readonly IServiceTypeReadOnlyRepository _repository;
        private readonly IMapper _mapper;
        public GetServiceTypeByIdUseCase(IServiceTypeReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseServiceTypeJson> Execute(int id)
        {
            var serviceType = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_TYPE_NOT_FOUND);

            return _mapper.Map<ResponseServiceTypeJson>(serviceType);
        }
    }
}
