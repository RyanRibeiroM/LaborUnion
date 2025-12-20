
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Service.Delete
{
    public class DeleteServiceUseCase : IDeleteServiceUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceReadOnlyRepository _serviceReadOnlyRepository;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ILoggedUser _loggedUser;
        private readonly IServiceWriteOnlyRepository _serviceWriteOnlyRepository;

        public DeleteServiceUseCase(IUnitOfWork unitOfWork, IServiceReadOnlyRepository serviceReadOnlyRepository, ISectorReadOnlyRepository sectorReadOnlyRepository, ILoggedUser loggedUser, IServiceWriteOnlyRepository serviceWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _serviceReadOnlyRepository = serviceReadOnlyRepository;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _loggedUser = loggedUser;
            _serviceWriteOnlyRepository = serviceWriteOnlyRepository;
        }

        public async Task Execute(int id)
        {
            var loggerUser = await _loggedUser.GetUser();
            var service = await _serviceReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_NOT_FOUND);
            var sectorPermission = await _sectorReadOnlyRepository.UserHasPermissionInSector(service.SectorId, loggerUser.Id);

            if (!sectorPermission && !Enum.IsDefined(typeof(PrivilegedUserRoles), (int)loggerUser.Role))
            {
                throw new NotFoundException(ResourceMessagesException.SERVICE_NOT_FOUND);
            }

            await _serviceWriteOnlyRepository.Delete(service.Id);

            await _unitOfWork.Commit();
        }
    }
}
