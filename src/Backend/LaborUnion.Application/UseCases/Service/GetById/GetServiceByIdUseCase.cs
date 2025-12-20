using AutoMapper;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;
using System.Linq.Expressions;

namespace LaborUnion.Application.UseCases.Service.GetById
{
    public class GetServiceByIdUseCase : IGetServiceByIdUseCase
    {
        private readonly IServiceReadOnlyRepository _repository;
        private readonly ILoggedUser _loggedUser;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly IMapper _mapper;
        public GetServiceByIdUseCase(IServiceReadOnlyRepository repository, IMapper mapper, ILoggedUser loggedUser, ISectorReadOnlyRepository sectorReadOnlyRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _loggedUser = loggedUser;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
        }
        public async Task<ResponseServiceJson> Execute(int id)
        {
            var service = await _repository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_NOT_FOUND);

            var loggerUser = await _loggedUser.GetUser();

            var sectorPermission = await _sectorReadOnlyRepository.UserHasPermissionInSector(service.SectorId, loggerUser.Id);

            if (!sectorPermission && !Enum.IsDefined(typeof(PrivilegedUserRoles), (int)loggerUser.Role))
            {
                throw new NotFoundException(ResourceMessagesException.SERVICE_NOT_FOUND);
            }

            return _mapper.Map<ResponseServiceJson>(service);
        }
    }
}
