using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Document.Register
{
    public class RegisterDocumentValidator : AbstractValidator<RequestRegisterDocumentJson>
    {
        public RegisterDocumentValidator()
        {
            RuleFor(document => document.Name)
                .NotEmpty()
                .Must(name => name.Trim().Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME);

            RuleFor(document => document.DueDate)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.DUE_DATE_EMPTY)
                .GreaterThan(DateOnly.FromDateTime(DateTime.Today))
                    .WithMessage(ResourceMessagesException.INVALID_DUE_DATE);
                
        }
    }
}
