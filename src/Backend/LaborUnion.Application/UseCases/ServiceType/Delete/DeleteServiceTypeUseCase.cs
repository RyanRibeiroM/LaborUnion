
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.ServiceType.Delete
{
    public class DeleteServiceTypeUseCase : IDeleteServiceTypeUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly IServiceTypeWriteOnlyRepository _serviceTypeWriteOnlyRepository;

        public DeleteServiceTypeUseCase(IUnitOfWork unitOfWork, IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository, IServiceTypeWriteOnlyRepository serviceTypeWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _serviceTypeWriteOnlyRepository = serviceTypeWriteOnlyRepository;
        }
        public async Task Execute(int id)
        {
            var serviceType = await _serviceTypeReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SERVICE_TYPE_NOT_FOUND);

            await _serviceTypeWriteOnlyRepository.Delete(serviceType.Id);

            await _unitOfWork.Commit();
        }
    }
}
