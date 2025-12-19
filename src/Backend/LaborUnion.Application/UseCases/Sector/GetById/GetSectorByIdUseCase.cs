using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Sector.GetById
{
    public class GetSectorByIdUseCase : IGetSectorByIdUseCase
    {
        private readonly ISectorReadOnlyRepository _repository;
        private readonly IMapper _mapper;
        public GetSectorByIdUseCase(ISectorReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseSectorJson> Execute(int id)
        {
            var sector = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);

            return _mapper.Map<ResponseSectorJson>(sector);
        }
    }
}
