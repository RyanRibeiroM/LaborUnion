using AutoMapper.Configuration.Annotations;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Sector.Delete
{
    public class DeleteSectorUseCase : IDeleteSectorUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly IServiceReadOnlyRepository _serviceReadOnlyRepository;
        private readonly ISectorWriteOnlyRepository _sectorWriteOnlyRepository;

        public DeleteSectorUseCase(IUnitOfWork unitOfWork, ISectorReadOnlyRepository sectorReadOnlyRepository, IServiceReadOnlyRepository serviceReadOnlyRepository, ISectorWriteOnlyRepository sectorWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _serviceReadOnlyRepository = serviceReadOnlyRepository;
            _sectorWriteOnlyRepository = sectorWriteOnlyRepository;
        }
        public async Task Execute(int id)
        {
            var serviceType = await _sectorReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);

            var ExistService = await _serviceReadOnlyRepository.ExistServiceWithSectorId(id);

            if (ExistService)
                throw new ConflictException(ResourceMessagesException.EXISTING_SERVICES_IN_THE_SECTOR);

            await _sectorWriteOnlyRepository.Delete(serviceType.Id);

            await _unitOfWork.Commit();
        }
    }
}
