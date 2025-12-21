using LaborUnion.Application.UseCases.Sector;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Document.Update
{
    public class UpdateDocumentUseCase : IUpdateDocumentUseCase
    {
        private readonly IDocumentUpdateOnlyRepository _documentUpdateOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateDocumentUseCase(IDocumentUpdateOnlyRepository documentUpdateOnlyRepository, IUnitOfWork unitOfWork)
        {
            _documentUpdateOnlyRepository = documentUpdateOnlyRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(int id, RequestUpdateDocumentJson request)
        {
            var document = await _documentUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.DOCUMENT_NOT_FOUND);
            await Validate(document, request);

            document.Name = request.Name;
            document.Description = request.Description;
            document.DueDate = request.DueDate;

            _documentUpdateOnlyRepository.Update(document);
            await _unitOfWork.Commit();
        }

        static private async Task Validate(Domain.Entities.Document document, RequestUpdateDocumentJson request)
        {
            var validator = new UpdateDocumentValidator();
            var result = validator.Validate(request);

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
