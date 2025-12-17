using AutoMapper;
using LaborUnion.Application.UseCases.ServiceType.Resgister;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.ServiceType.Register
{
    public class RegisterServiceTypeUseCase : IRegisterServiceTypeUseCase
    {
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly IServiceTypeWriteOnlyRepository _serviceTypeWriteOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RegisterServiceTypeUseCase(
            IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository,
            IServiceTypeWriteOnlyRepository serviceTypeWriteOnlyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _serviceTypeWriteOnlyRepository = serviceTypeWriteOnlyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ResponseRegisteredServiceTypeJson> Execute(RequestRegisterServiceTypeJson request)
        {
            await Validate(request);

            var serviceType = _mapper.Map<Domain.Entities.ServiceType>(request);

            await _serviceTypeWriteOnlyRepository.Add(serviceType);
            await _unitOfWork.Commit();

            return _mapper.Map<ResponseRegisteredServiceTypeJson>(serviceType);
        }

        private async Task Validate(RequestRegisterServiceTypeJson request)
        {
            var validator = new ServiceTypeValidator();
            var result = validator.Validate(request);

            var nameExists = await _serviceTypeReadOnlyRepository.ExistActiveServiceTypeWithName(request.Name);
            if (nameExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Name), ResourceMessagesException.NAME_TYPE_SERVICE_ALREADY_REGISTERED));
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}

