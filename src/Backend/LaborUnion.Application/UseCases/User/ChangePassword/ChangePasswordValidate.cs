using FluentValidation;
using LaborUnion.Application.Shared.Validators;
using LaborUnion.Communication.Requests;

namespace LaborUnion.Application.UseCases.User.ChangePassword
{
    public class ChangePasswordValidate : AbstractValidator<RequestChangePasswordJson>
    {
        public ChangePasswordValidate()
        {
            Include(new PasswordValidator<RequestChangePasswordJson>("NewPassword"));
        }
    }
}
