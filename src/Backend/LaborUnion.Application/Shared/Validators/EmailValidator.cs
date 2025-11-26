using FluentValidation;
using LaborUnion.Exceptions;
using System.Reflection;

namespace LaborUnion.Application.Shared.Validators
{
    public class EmailValidator<T> : AbstractValidator<T> where T : class
    {
        public EmailValidator()
        {
            RuleFor(x => EmailValidator<T>.GetEmailValue(x))
                .NotEmpty().WithMessage(ResourceMessagesException.EMAIL_EMPTY)
                .EmailAddress().WithMessage(ResourceMessagesException.EMAIL_INVALID);
        }

        private static string GetEmailValue(T instance)
        {
            var prop = typeof(T).GetProperty("Email", BindingFlags.Public | BindingFlags.Instance);
            return prop?.GetValue(instance) as string ?? string.Empty;
        }
    }
}
