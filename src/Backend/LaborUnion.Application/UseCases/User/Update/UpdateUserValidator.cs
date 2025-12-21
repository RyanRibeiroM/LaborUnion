using FluentValidation;
using LaborUnion.Application.Shared.Validators;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.User.Update
{
    internal class UpdateUserValidator : AbstractValidator<RequestUpdateUserJson>
    {
        public UpdateUserValidator()
        {
            RuleFor(user => user.Name)
                .NotEmpty()
                .WithMessage(ResourceMessagesException.NAME_EMPTY);

            Include(new EmailValidator<RequestUpdateUserJson>());

            RuleFor(user => user.Role)
                .IsInEnum()
                .WithMessage(ResourceMessagesException.USER_ROLE_NOT_SUPPORTED);

            When(user => !string.IsNullOrWhiteSpace(user.Password), () =>
            {
                Include(new PasswordValidator<RequestUpdateUserJson>());
            });
        }

    }
}
