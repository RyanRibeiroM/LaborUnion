using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Farmer.GetById
{
    public class GetFarmerByIdUseCase : IGetFarmerByIdUseCase
    {
        private readonly IFarmerReadOnlyRepository _repository;
        private readonly IMapper _mapper;
        public GetFarmerByIdUseCase(IFarmerReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseFarmerJson> Execute(int id)
        {
            var farmer = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.FARMER_NOT_FOUND);

            return _mapper.Map<ResponseFarmerJson>(farmer);
        }
    }
}
