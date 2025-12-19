using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Sector
{
    public class SectorValidator : AbstractValidator<RequestRegisterSectorJson>
    {
        public SectorValidator()
        {
            RuleFor(sector => sector.Name)
                .NotEmpty()
                .Must(name => name.Trim().Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME);

        }
    }

}
