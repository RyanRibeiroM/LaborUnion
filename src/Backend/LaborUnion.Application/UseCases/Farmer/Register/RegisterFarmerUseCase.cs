using AutoMapper;
using LaborUnion.Application.Utils;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Farmer.Register
{
    public class RegisterFarmerUseCase : IRegisterFarmerUseCase
    {
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IFarmerWriteOnlyRepository _farmerWriteOnlyRepository;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILoggedUser _loggedUser;

        public RegisterFarmerUseCase(
            IFarmerReadOnlyRepository farmerReadOnlyRepository,
            IFarmerWriteOnlyRepository farmerWriteOnlyRepository,
            IUserReadOnlyRepository userReadOnlyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILoggedUser loggedUser)
        {
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _farmerWriteOnlyRepository = farmerWriteOnlyRepository;
            _userReadOnlyRepository = userReadOnlyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _loggedUser = loggedUser;
        }

        public async Task<ResponseRegisteredFarmerJson> Execute(RequestRegisterFarmerJson request)
        {
            await Validate(request);

            var adminUser = await _loggedUser.GetUser();

            var farmer = _mapper.Map<Domain.Entities.Farmer>(request);

            farmer.Cpf = CpfUtils.Format(request.Cpf);
            farmer.AddressUf = UfUtils.Format(request.AddressUf);
            farmer.RegisteredBy = adminUser.Id;

            if (!string.IsNullOrWhiteSpace(request.SpouseCpf))
            {
                farmer.SpouseCpf = CpfUtils.Format(request.SpouseCpf);
            }

            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                farmer.Phone = PhoneUtils.Format(request.Phone);
            }

            await _farmerWriteOnlyRepository.Add(farmer);
            await _unitOfWork.Commit();

            return _mapper.Map<ResponseRegisteredFarmerJson>(farmer);
        }

        private async Task Validate(RequestRegisterFarmerJson request)
        {
            var validator = new FarmerValidator();
            var result = validator.Validate(request);

            var cleanCpf = CpfUtils.Format(request.Cpf);

            var cpfExists = await _farmerReadOnlyRepository.ExistActiveFarmerWithCpf(cleanCpf);
            if (cpfExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Cpf), ResourceMessagesException.CPF_ALREADY_REGISTERED));
            }

            var registrationExists = await _farmerReadOnlyRepository.ExistActiveFarmerWithRegistration(request.Registration);
            if (registrationExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Registration), ResourceMessagesException.REGISTRATION_ALREADY_EXISTS));
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExistsInFarmers = await _farmerReadOnlyRepository.ExistActiveFarmerWithEmail(request.Email);

                var emailExistsInUsers = await _userReadOnlyRepository.ExistWithEmailAsync(request.Email);

                if (emailExistsInFarmers || emailExistsInUsers)
                {
                    result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Email), ResourceMessagesException.EMAIL_ALREADY_EXISTS));
                }
            }

            var cleanSpouseCpf = CpfUtils.Format(request.SpouseCpf);
            var spouseCpfExists = await _farmerReadOnlyRepository.ExistActiveFarmerWithSpouseCpf(cleanSpouseCpf);
            if (spouseCpfExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.SpouseCpf), ResourceMessagesException.SPOUSE_CPF_ALREADY_LINKED_TO_A_FARMER));
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}