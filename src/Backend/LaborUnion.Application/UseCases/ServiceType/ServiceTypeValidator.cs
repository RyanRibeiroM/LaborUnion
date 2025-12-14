using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Domain.Repositories.ServiceType
{
    public class ServiceTypeValidator : AbstractValidator<RequestRegisterServiceTypeJson>
    {
        public ServiceTypeValidator()
        {
            RuleFor(farmer => farmer.Name)
                .NotEmpty()
                .Must(name => name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME);
        }
    }
}
