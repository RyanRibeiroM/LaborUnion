using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Service.Register
{
    public class RegisterServiceUseCase : IRegisterServiceUseCase
    {

        private readonly IServiceWriteOnlyRepository _serviceWriteOnlyRepository;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly ILoggedUser _loggedUser;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RegisterServiceUseCase(IServiceWriteOnlyRepository serviceWriteOnlyRepository, ISectorReadOnlyRepository sectorReadOnlyRepository,
            IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository, IFarmerReadOnlyRepository farmerReadOnlyRepository, ILoggedUser loggedUser, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _serviceWriteOnlyRepository = serviceWriteOnlyRepository;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _loggedUser = loggedUser;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ResponseRegisteredServiceJson> Execute(RequestRegisterServiceJson request)
        {
            var loggerUser = await _loggedUser.GetUser();

            var sector = await _sectorReadOnlyRepository.GetById(request.SectorId) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);

            var serviceType = await _serviceTypeReadOnlyRepository.GetById(request.ServiceTypeId) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_TYPE_NOT_FOUND);

            var farmer = await _farmerReadOnlyRepository.GetById(request.FarmerId) ?? throw new NotFoundException(ResourceMessagesException.FARMER_NOT_FOUND);

            await Validate(request, loggerUser);

            var service = _mapper.Map<Domain.Entities.Service>(request);

            service.AttendantId = loggerUser.Id;

            await _serviceWriteOnlyRepository.Add(service);
            await _unitOfWork.Commit();

            return new ResponseRegisteredServiceJson() {
                SectorName = sector.Name,
                ServiceTypeName = serviceType.Name,
                FarmerName = farmer.Name,
                Status = service.Status.ToString()
            };

        }

        private async Task Validate(RequestRegisterServiceJson request, Domain.Entities.User loggerUser)
        {
            var validator = new ServiceValidator();
            var result = validator.Validate(request);

            var sectorPermission = await _sectorReadOnlyRepository.UserHasPermissionInSector(request.SectorId, loggerUser.Id);

            if (!sectorPermission && !Enum.IsDefined(typeof(PrivilegedUserRoles), (int)loggerUser.Role))
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.SectorId), ResourceMessagesException.USER_WITHOUT_PERMISSION_IN_THE_SECTOR));
            }

            var serviceTypePermission = await _serviceTypeReadOnlyRepository.ServiceTypeCanProvidedBySector(request.ServiceTypeId, request.SectorId);
            if (!serviceTypePermission)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.ServiceTypeId), ResourceMessagesException.SERVICE_TYPE_CANNOT_BE_PROVIDED_BY_SECTOR));
            }

            var farmerIsAlive = await _farmerReadOnlyRepository.ActiveFarmerWithIdIsAlive(request.FarmerId);
            if (!farmerIsAlive)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.FarmerId), ResourceMessagesException.FARMER_IS_NOT_ALIVE));
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
