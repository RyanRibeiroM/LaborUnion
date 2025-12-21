using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Document.Register
{
    public class RegisterDocumentUseCase : IRegisterDocumentUseCase
    {
        private readonly IDocumentWriteOnlyRepository _documentWriteOnlyRepository;
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RegisterDocumentUseCase(
            IDocumentWriteOnlyRepository documentWriteOnlyRepository,
            IFarmerReadOnlyRepository farmerReadOnlyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _documentWriteOnlyRepository = documentWriteOnlyRepository;
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ResponseRegisteredDocumentJson> Execute(RequestRegisterDocumentJson request)
        {
            await Validate(request);

            var farmer = await _farmerReadOnlyRepository.GetById(request.FarmerId) ?? throw new NotFoundException(ResourceMessagesException.FARMER_NOT_FOUND);

            var document = _mapper.Map<Domain.Entities.Document>(request);

            await _documentWriteOnlyRepository.Add(document);
            await _unitOfWork.Commit();

            var response = _mapper.Map<ResponseRegisteredDocumentJson>(document);
            response.FarmerName = farmer.Name;
            return response;
        }

        static private async Task Validate(RequestRegisterDocumentJson request)
        {
            var validator = new RegisterDocumentValidator();
            var result = validator.Validate(request);
            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
