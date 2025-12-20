using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Service.Update
{
    internal class UpdateServiceValidator : AbstractValidator<RequestUpdateServiceJson>
    {
        public UpdateServiceValidator()
        {
            RuleFor(service => service.Status).IsInEnum().WithMessage(ResourceMessagesException.SERVICE_STATUS_NOT_SUPPORTED);
        }
    }
}
