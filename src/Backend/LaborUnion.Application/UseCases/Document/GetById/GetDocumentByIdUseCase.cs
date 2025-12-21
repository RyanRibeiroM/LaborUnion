using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Document.GetById
{
    public class GetDocumentByIdUseCase : IGetDocumentByIdUseCase
    {
        private readonly IDocumentReadOnlyRepository _repository;
        private readonly IMapper _mapper;
        public GetDocumentByIdUseCase(IDocumentReadOnlyRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<ResponseDocumentJson> Execute(int id)
        {
            var document = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.DOCUMENT_NOT_FOUND);

            return _mapper.Map<ResponseDocumentJson>(document);
        }
    }
}
