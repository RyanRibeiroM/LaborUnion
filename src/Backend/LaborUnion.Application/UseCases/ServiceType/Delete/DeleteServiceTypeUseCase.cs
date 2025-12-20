
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.ServiceType.Delete
{
    public class DeleteServiceTypeUseCase : IDeleteServiceTypeUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly IServiceTypeWriteOnlyRepository _serviceTypeWriteOnlyRepository;
        private readonly IServiceReadOnlyRepository _serviceReadOnlyRepository;

        public DeleteServiceTypeUseCase(IUnitOfWork unitOfWork, IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository, IServiceTypeWriteOnlyRepository serviceTypeWriteOnlyRepository, IServiceReadOnlyRepository serviceReadOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _serviceTypeWriteOnlyRepository = serviceTypeWriteOnlyRepository;
            _serviceReadOnlyRepository = serviceReadOnlyRepository;
        }
        public async Task Execute(int id)
        {
            var serviceType = await _serviceTypeReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_TYPE_NOT_FOUND);

            var existServiceWiththisType = await _serviceReadOnlyRepository.ExistServiceWithServiceTypeId(id);

            if (existServiceWiththisType)
                throw new ConflictException(ResourceMessagesException.EXISTING_SERVICES_WITH_SERVICE_TYPE);

            await _serviceTypeWriteOnlyRepository.Delete(serviceType.Id);

            await _unitOfWork.Commit();
        }
    }
}
