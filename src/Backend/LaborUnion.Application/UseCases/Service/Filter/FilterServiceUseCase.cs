using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Dtos;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Services.LoggedUser;

namespace LaborUnion.Application.UseCases.Service.Filter
{
    public class FilterServiceUseCase : IFilterServiceUseCase
    {
        private readonly IServiceReadOnlyRepository _serviceReadOnlyRepository;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ILoggedUser _loggedUser;
        private readonly IMapper _mapper;

        public FilterServiceUseCase(IServiceReadOnlyRepository serviceReadOnlyRepository, ISectorReadOnlyRepository sectorReadOnlyRepository,
            ILoggedUser loggedUser, IMapper mapper)
        {
            _serviceReadOnlyRepository = serviceReadOnlyRepository;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _loggedUser = loggedUser;
            _mapper = mapper;
        }
        public async Task<ResponseServicesJson> Execute(RequestFilterServiceJson request)
        {
            var filter = new FilterServiceDto() 
            {
                FarmerId = request.FarmerId,
                FarmerName = request.FarmerName,
                FarmerCpf = request.FarmerCpf,
                ServiceDate = request.ServiceDate,
                AttendantId  = request.AttendantId,
                AttendantName = request.AttendantName,
                Status = (ServiceStatus?)request.Status,
                ServiceTypeId = request.ServiceTypeId,
                ServiceTypeName = request.ServiceTypeName,
                SectorId = request.SectorId,
                SectorName = request.SectorName
            };

            var services = await _serviceReadOnlyRepository.Filter(filter);

            var loggerUser = await _loggedUser.GetUser();
            var sectorPermission = await _sectorReadOnlyRepository.GetActiveSectorsidsWithUserId(loggerUser.Id);
            

            if(!Enum.IsDefined(typeof(PrivilegedUserRoles), (int)loggerUser.Role))
            {
                services = services.Where(s => s.Sector != null && sectorPermission.Contains(s.Sector.Id)).ToList();
            }

            return new ResponseServicesJson()
            {
                Services = _mapper.Map<IList<ResponseServiceShortJson>>(services)
            };
        }
    }
}
