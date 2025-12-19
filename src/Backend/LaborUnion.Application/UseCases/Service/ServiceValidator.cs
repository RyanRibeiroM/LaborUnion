using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Service
{
    public class ServiceValidator : AbstractValidator<RequestRegisterServiceJson>
    {
        public ServiceValidator() {
            RuleFor(service => service.Status).IsInEnum().WithMessage(ResourceMessagesException.SERVICE_STATUS_NOT_SUPPORTED);
        }
    }
    
}
