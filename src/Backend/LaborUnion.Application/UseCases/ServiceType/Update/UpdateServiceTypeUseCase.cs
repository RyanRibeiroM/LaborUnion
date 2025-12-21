using LaborUnion.Application.UseCases.Sector;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.ServiceType.Update
{
    public class UpdateServiceTypeUseCase : IUpdateServiceTypeUseCase
    {
        private readonly IServiceTypeReadOnlyRepository _serviceTypeReadOnlyRepository;
        private readonly IServiceTypeUpdateOnlyRepository _serviceTypeUpdateOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateServiceTypeUseCase(IServiceTypeReadOnlyRepository serviceTypeReadOnlyRepository, IServiceTypeUpdateOnlyRepository serviceTypeUpdateOnlyRepository, IUnitOfWork unitOfWork)
        {
            _serviceTypeReadOnlyRepository = serviceTypeReadOnlyRepository;
            _serviceTypeUpdateOnlyRepository = serviceTypeUpdateOnlyRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(int id, RequestUpdateServiceTypeJson request)
        {
            var serviceType = await _serviceTypeUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);
            await Validate(serviceType, request);

            serviceType.Name = request.Name;
            serviceType.Description = request.Description;

            _serviceTypeUpdateOnlyRepository.Update(serviceType);
            await _unitOfWork.Commit();
        }

        private async Task Validate(Domain.Entities.ServiceType serviceType, RequestUpdateServiceTypeJson request)
        {
            var validator = new UpdateServiceTypeValidator();
            var result = validator.Validate(request);

            if (!request.Name.Equals(serviceType.Name))
            {
                var nameExists = await _serviceTypeReadOnlyRepository.ExistActiveServiceTypeWithName(request.Name);
                if (nameExists)
                {
                    result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Name), ResourceMessagesException.NAME_SECTOR_ALREADY_REGISTERED));
                }
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
