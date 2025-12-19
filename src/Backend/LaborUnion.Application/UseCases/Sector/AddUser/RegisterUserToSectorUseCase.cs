using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Sector.AddUser
{
    public class RegisterUserToSectorUseCase : IRegisterUserToSectorUseCase
    {
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ISectorWriteOnlyRepository _sectorWriteOnlyRepository;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public RegisterUserToSectorUseCase(ISectorReadOnlyRepository sectorReadOnlyRepository, ISectorWriteOnlyRepository sectorWriteOnlyRepository, IUserReadOnlyRepository userReadOnlyRepository, IUnitOfWork unitOfWork)
        {
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _sectorWriteOnlyRepository = sectorWriteOnlyRepository;
            _userReadOnlyRepository = userReadOnlyRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task<ResponseRegisteredSectorUserJson> Execute(int sectorId, RequestRegisterUserToSectorJson request)
        {
            var existSectorUser = await _sectorReadOnlyRepository.UserHasPermissionInSector(sectorId, request.UserId);

            if (existSectorUser)
            {
                throw new ConflictException(ResourceMessagesException.USER_ALREADY_HAS_PERMISSION_IN_SECTOR);
            }

            var sector = await _sectorReadOnlyRepository.GetById(sectorId) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);
            var user = await _userReadOnlyRepository.GetById(request.UserId) ?? throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            var sectorUser = new Domain.Entities.SectorUser() 
            { 
                UserId = request.UserId,
                SectorId = sectorId

            };

             await _sectorWriteOnlyRepository.AddUserToSector(sectorUser);
            await _unitOfWork.Commit();

            return new ResponseRegisteredSectorUserJson
            {
                SectorName = sector.Name,
                UserName = user.Name
            };
        }
    }
}
