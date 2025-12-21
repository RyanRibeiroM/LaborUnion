using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Sector;

namespace LaborUnion.Application.UseCases.Document.Filter
{
    public class FilterDocumentUseCase : IFilterDocumentUseCase
    {
        private readonly IDocumentReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public FilterDocumentUseCase(IDocumentReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseDocumentsJson> Execute(RequestFilterDocumentJson request)
        {
            var filters = new FilterDocumentDto
            {
                Name = request.Name,
                IsExpired = request.IsExpired,
                FarmerId = request.FarmerId,
                FarmerName = request.FarmerName,
                CreatedOn = request.CreatedOn,
                DueDate = request.DueDate
            };

            var documents = await _repository.Filter(filters);

            return new ResponseDocumentsJson
            {
                Documents = _mapper.Map<IList<ResponseDocumentShortJson>>(documents)
            };
        }
    }
}
