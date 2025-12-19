using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Sector.RemovePermission
{
    public class RemovePermissionUserToSectorUseCase : IRemovePermissionUserToSectorUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ISectorWriteOnlyRepository _sectorWriteOnlyRepository;

        public RemovePermissionUserToSectorUseCase(IUnitOfWork unitOfWork, ISectorReadOnlyRepository sectorReadOnlyRepository, ISectorWriteOnlyRepository sectorWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _sectorWriteOnlyRepository = sectorWriteOnlyRepository;
        }

        public async Task Execute(int sectorId, int userId)
        {
            var exist = await _sectorReadOnlyRepository.UserHasPermissionInSector(sectorId, userId);

            if (!exist)
            {
                throw new NotFoundException(ResourceMessagesException.NO_PERMISSION_FOUND_FOR_USER);
            }

            await _sectorWriteOnlyRepository.RemoveUserToSector(sectorId, userId);

            await _unitOfWork.Commit();
        }
    }
}
