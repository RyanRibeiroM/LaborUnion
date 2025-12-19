using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaborUnion.Application.UseCases.Sector.Register
{
    public class RegisterSectorUseCase : IRegisterSectorUseCase
    {
        private readonly ISectorReadOnlyRepository _sectorReadOnlyRepository;
        private readonly ISectorWriteOnlyRepository _sectorWriteOnlyRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public RegisterSectorUseCase(
            ISectorReadOnlyRepository sectorReadOnlyRepository,
            ISectorWriteOnlyRepository sectorWriteOnlyRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _sectorReadOnlyRepository = sectorReadOnlyRepository;
            _sectorWriteOnlyRepository = sectorWriteOnlyRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ResponseRegisteredSectorJson> Execute(RequestRegisterSectorJson request)
        {
            await Validate(request);

            var serviceType = _mapper.Map<Domain.Entities.Sector>(request);

            await _sectorWriteOnlyRepository.Add(serviceType);
            await _unitOfWork.Commit();

            return _mapper.Map<ResponseRegisteredSectorJson>(serviceType);
        }

        private async Task Validate(RequestRegisterSectorJson request)
        {
            var validator = new SectorValidator();
            var result = validator.Validate(request);

            var nameExists = await _sectorReadOnlyRepository.ExistActiveSectorWithName(request.Name);
            if (nameExists)
            {
                result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Name), ResourceMessagesException.NAME_SECTOR_ALREADY_REGISTERED));
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
