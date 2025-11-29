using FluentValidation;
using LaborUnion.Application.Utils;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.Farmer
{
    public class FarmerValidator : AbstractValidator<RequestRegisterFarmerJson>
    {
        private const string TextOnlyRegex = @"^[a-zA-Z\u00C0-\u017F\s'-]+$";
        private const string TextAndNumbersRegex = @"^[a-zA-Z0-9\u00C0-\u017F\s.,'-]+$";

        public FarmerValidator()
        {
            RuleFor(farmer => farmer.Name)
                .NotEmpty()
                .Must(name => name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME)
                .Matches(TextOnlyRegex)
                    .WithMessage(ResourceMessagesException.NAME_WITH_SPECIAL_CHARACTERS);

            RuleFor(farmer => farmer.Cpf)
                .NotEmpty()
                .Must(CpfUtils.ValidCPF)
                    .WithMessage(ResourceMessagesException.INVALID_CPF);

            RuleFor(farmer => farmer.Registration)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.REGISTRATION_EMPTY);

            RuleFor(farmer => farmer.AddressNumber)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.INVALID_ADDRESS_NUMBER);

            RuleFor(farmer => farmer.AddressNeighborhood)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.INVALID_ADDRESS_NEIGHBORHOOD)
                .Matches(TextAndNumbersRegex)
                    .WithMessage(ResourceMessagesException.ADDRESS_WITH_SPECIAL_CHARACTERS);

            RuleFor(farmer => farmer.AddressCity)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.INVALID_ADDRESS_CITY)
                .Matches(TextAndNumbersRegex)
                    .WithMessage(ResourceMessagesException.ADDRESS_WITH_SPECIAL_CHARACTERS);

            RuleFor(farmer => farmer.AddressUf)
                .NotEmpty()
                .Must(UfUtils.IsValidUf)
                    .WithMessage(ResourceMessagesException.INVALID_ADDRESS_UF);

            RuleFor(farmer => farmer.AddressCep)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.INVALID_ADDRESS_CEP);


            When(farmer => !string.IsNullOrWhiteSpace(farmer.Email), () =>
            {
                RuleFor(farmer => farmer.Email)
                    .Must(EmailUtils.IsValidEmail)
                    .WithMessage(ResourceMessagesException.EMAIL_INVALID);
            });

            When(farmer => !string.IsNullOrWhiteSpace(farmer.Phone), () =>
            {
                RuleFor(farmer => farmer.Phone)
                    .Must(PhoneUtils.IsValidPhoneNumber)
                    .WithMessage(ResourceMessagesException.INVALID_PHONE_NUMBER);
            });
        }
    }
}