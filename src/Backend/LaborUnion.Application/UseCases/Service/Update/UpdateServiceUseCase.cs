using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Service.Update
{
    public class UpdateServiceUseCase : IUpdateServiceUseCase
    {
        private readonly IServiceUpdateOnlyRepository _serviceUpdateOnlyRepository;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly ILoggedUser _loggedUser;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateServiceUseCase(IServiceUpdateOnlyRepository serviceUpdateOnlyRepository, ISectorReadOnlyRepository sectorReadOnlyRepository,
            IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository, ILoggedUser loggedUser, IUnitOfWork unitOfWork)
        {
            _serviceUpdateOnlyRepository = serviceUpdateOnlyRepository;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _loggedUser = loggedUser;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(int id, RequestUpdateServiceJson request)
        {
            var loggerUser = await _loggedUser.GetUser();
            var service = await _serviceUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_NOT_FOUND);

            await Validate(request, loggerUser);

            service.ServiceTypeId = request.ServiceTypeId;
            service.Status = (ServiceStatus)request.Status;
            service.SectorId = request.SectorId;
            service.Notes = request.Notes;

            _serviceUpdateOnlyRepository.Update(service);
            await _unitOfWork.Commit();
        }

        private async Task Validate(RequestUpdateServiceJson request, Domain.Entities.User loggerUser)
        {
            var validator = new UpdateServiceValidator();
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

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
