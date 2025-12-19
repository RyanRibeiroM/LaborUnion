using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Domain.Repositories.ServiceType
{
    public class ServiceTypeValidator : AbstractValidator<RequestRegisterServiceTypeJson>
    {
        public ServiceTypeValidator()
        {
            RuleFor(service => service.Name)
                .NotEmpty()
                .Must(name => name.Trim().Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME);
        }
    }
}
