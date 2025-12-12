using AutoMapper;
using LaborUnion.Application.Utils;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Farmer.Update
{
    public class UpdateFarmerUseCase : IUpdateFarmerUseCase
    {
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IFarmerWriteOnlyRepository _farmerWriteOnlyRepository;
        private readonly IFarmerUpdateOnlyRepository _farmerUpdateOnlyRepository;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly ILoggedUser _loggedUser;
        public UpdateFarmerUseCase(
            IFarmerReadOnlyRepository farmerReadOnlyRepository,
            IFarmerWriteOnlyRepository farmerWriteOnlyRepository,
            IFarmerUpdateOnlyRepository farmerUpdateOnlyRepository,
            IUserReadOnlyRepository userReadOnlyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            ILoggedUser loggedUser)
        {
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _farmerWriteOnlyRepository = farmerWriteOnlyRepository;
            _farmerUpdateOnlyRepository = farmerUpdateOnlyRepository;
            _userReadOnlyRepository = userReadOnlyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _loggedUser = loggedUser;
        }

        public async Task Execute(int id, RequestRegisterFarmerJson request)
        {
            var farmer = await _farmerUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.FARMER_NOT_FOUND);
            
            await Validate(request, farmer);

            farmer.Name = request.Name;
            farmer.Email = request.Email;
            farmer.Cpf = CpfUtils.Format(request.Cpf);
            farmer.Registration = request.Registration;
            farmer.SpouseName = request.SpouseName;
            farmer.BirthDate = request.BirthDate;
            farmer.IsAlive = request.IsAlive;
            farmer.AddressNumber = request.AddressNumber;
            farmer.AddressNeighborhood = request.AddressNeighborhood;
            farmer.AddressCity = request.AddressCity;
            farmer.AddressUf = UfUtils.Format(request.AddressUf);
            farmer.AddressCep = request.AddressCep;
            farmer.AddressReference = request.AddressReference;


            if (!string.IsNullOrWhiteSpace(request.SpouseCpf))
            {
                farmer.SpouseCpf = CpfUtils.Format(request.SpouseCpf);
            }

            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                farmer.Phone = PhoneUtils.Format(request.Phone);
            }

            _farmerUpdateOnlyRepository.Update(farmer);
            await _unitOfWork.Commit();
        }

        private async Task Validate(RequestRegisterFarmerJson request, Domain.Entities.Farmer farmer)
        {
            var validator = new FarmerValidator();
            var result = validator.Validate(request);

            var cleanCpf = CpfUtils.Format(request.Cpf);

            var cpfExists = farmer.Cpf != cleanCpf && await _farmerReadOnlyRepository.ExistActiveFarmerWithCpf(cleanCpf);
            if (cpfExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Cpf), ResourceMessagesException.CPF_ALREADY_REGISTERED));
            }

            var registrationExists = farmer.Registration != request.Registration && await _farmerReadOnlyRepository.ExistActiveFarmerWithRegistration(request.Registration);
            if (registrationExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Registration), ResourceMessagesException.REGISTRATION_ALREADY_EXISTS));
            }

            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                var emailExistsInFarmers = farmer.Email != request.Email && await _farmerReadOnlyRepository.ExistActiveFarmerWithEmail(request.Email);

                var emailExistsInUsers = farmer.Email != request.Email && await _userReadOnlyRepository.ExistWithEmailAsync(request.Email);

                if (emailExistsInFarmers || emailExistsInUsers)
                {
                    result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Email), ResourceMessagesException.EMAIL_ALREADY_EXISTS));
                }
            }

            var cleanSpouseCpf = CpfUtils.Format(request.SpouseCpf);
            var spouseCpfExists = farmer.SpouseCpf != cleanSpouseCpf && await _farmerReadOnlyRepository.ExistActiveFarmerWithSpouseCpf(cleanSpouseCpf);
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
