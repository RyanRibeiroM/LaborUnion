using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories.Document;

namespace LaborUnion.Application.UseCases.Dashboard.GetDocument
{
    public class GetDashboardDocumentUseCase : IGetDashboardDocumentUseCase
    {
        private readonly IDocumentReadOnlyRepository _repository;
        private readonly IMapper _mapper;

        public GetDashboardDocumentUseCase(IDocumentReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseDocumentsJson> Execute()
        {
            var documents = await _repository.GetForDashboard();

            return new ResponseDocumentsJson
            {
                Documents = _mapper.Map<IList<ResponseDocumentShortJson>>(documents)
            };
        }
    }
}
