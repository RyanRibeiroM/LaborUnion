using FluentValidation;
using LaborUnion.Exceptions;
using System.Reflection;

namespace LaborUnion.Application.Shared.Validators
{
    public class PasswordValidator<T> : AbstractValidator<T> where T : class
    {
        public PasswordValidator()
        {
            RuleFor(x => PasswordValidator<T>.GetPasswordValue(x))
                .NotEmpty().WithMessage(ResourceMessagesException.PASSWORD_EMPTY)
                .MinimumLength(8).WithMessage(ResourceMessagesException.PASSWORD_MINIMUM_LENGTH_EIGTH_CHAR)
                .Matches("[A-Z]").WithMessage(ResourceMessagesException.PASSWORD_MUST_CONTAIN_UPPERCASE)
                .Matches("[a-z]").WithMessage(ResourceMessagesException.PASSWORD_MUST_CONTAIN_LOWERCASE)
                .Matches("[0-9]").WithMessage(ResourceMessagesException.PASSWORD_MUST_CONTAIN_NUMBER)
                .Matches("[^a-zA-Z0-9]").WithMessage(ResourceMessagesException.PASSWORD_MUST_CONTAIN_SPECIAL_CHAR);
        }

        private static string GetPasswordValue(T instance)
        {
            var prop = typeof(T).GetProperty("Password", BindingFlags.Public | BindingFlags.Instance);
            return prop?.GetValue(instance) as string ?? string.Empty;
        }
    }
}
