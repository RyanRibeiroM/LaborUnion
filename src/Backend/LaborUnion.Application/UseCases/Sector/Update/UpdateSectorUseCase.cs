using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Sector.Update
{
    public class UpdateSectorUseCase : IUpdateSectorUseCase
    {
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ISectorUpdateOnlyRepository _sectorUpdateOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateSectorUseCase(ISectorReadOnlyRepository sectorReadOnlyRepository, ISectorUpdateOnlyRepository sectorUpdateOnlyRepository, IUnitOfWork unitOfWork)
        {
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _sectorUpdateOnlyRepository = sectorUpdateOnlyRepository;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(int id, RequestRegisterSectorJson request)
        {
            var sector = await _sectorUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.SECTOR_NOT_FOUND);
            await Validate(sector, request);

            sector.Name = request.Name;
            sector.Description = request.Description;

            _sectorUpdateOnlyRepository.Update(sector);
            await _unitOfWork.Commit();
        }

        private async Task Validate(Domain.Entities.Sector sector, RequestRegisterSectorJson request)
        {
            var validator = new SectorValidator();
            var result = validator.Validate(request);

            if (!request.Name.Equals(sector.Name))
            {
                var nameExists = await _sectorReadOnlyRepository.ExistActiveSectorWithName(request.Name);
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
