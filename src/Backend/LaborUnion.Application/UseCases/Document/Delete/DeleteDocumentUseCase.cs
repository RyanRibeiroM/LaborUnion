
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Document.Delete
{
    public class DeleteDocumentUseCase : IDeleteDocumentUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDocumentReadOnlyRepository _documentReadOnlyRepository;
        private readonly IDocumentWriteOnlyRepository _documentWriteOnlyRepository;

        public DeleteDocumentUseCase(IUnitOfWork unitOfWork, IDocumentReadOnlyRepository documentReadOnlyRepository, IDocumentWriteOnlyRepository documentWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _documentReadOnlyRepository = documentReadOnlyRepository;
            _documentWriteOnlyRepository = documentWriteOnlyRepository;
        }
        public async Task Execute(int id)
        {
            var document = await _documentReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.DOCUMENT_NOT_FOUND);

            await _documentWriteOnlyRepository.Delete(document.Id);

            await _unitOfWork.Commit();
        }
    }
}
