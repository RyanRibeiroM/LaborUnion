using FluentValidation;
using FluentValidation.Validators;
using LaborUnion.Application.Shared.Validators;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.User.Register
{
    public class RegisterUserValidator : AbstractValidator<RequestRegisterUserJson>
    {
        public RegisterUserValidator()
        {
            RuleFor(user => user.Name)
                .NotEmpty()
                .WithMessage(ResourceMessagesException.NAME_EMPTY);

            Include(new Shared.Validators.EmailValidator<RequestRegisterUserJson>());
            Include(new PasswordValidator<RequestRegisterUserJson>());
        }
    }
}
