using FluentValidation;
using LaborUnion.Application.Shared.Validators;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.User.UpdateProfile
{
    public class UpdateUserProfileValidator : AbstractValidator<RequestUpdateUserProfileJson>
    {
        public UpdateUserProfileValidator()
        {
            RuleFor(user => user.Name)
                .NotEmpty()
                .WithMessage(ResourceMessagesException.NAME_EMPTY);

            Include(new EmailValidator<RequestUpdateUserProfileJson>());


            When(user => !string.IsNullOrWhiteSpace(user.Password), () =>
            {
                Include(new PasswordValidator<RequestUpdateUserProfileJson>());
            });
        }
    }
}
