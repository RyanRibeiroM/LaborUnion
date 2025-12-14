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

            When(farmer => !string.IsNullOrWhiteSpace(farmer.SpouseCpf), () =>
            {
                RuleFor(farmer => farmer.SpouseName)
                    .NotEmpty()
                    .WithMessage(ResourceMessagesException.SPOUSE_NAME_REQUIRED);

                RuleFor(farmer => farmer.SpouseCpf)
                .Must(CpfUtils.ValidCPF!)
                    .WithMessage(ResourceMessagesException.INVALID_SPOUSE_CPF)
                .Must((request, spouseCpf) =>
                {
                    string farmerCpfClean = CpfUtils.Format(request.Cpf);
                    string spouseCpfClean = CpfUtils.Format(request.SpouseCpf!);

                    return farmerCpfClean != spouseCpfClean;
                })
                .WithMessage(ResourceMessagesException.SPOUSE_CPF_EQUAL_TO_FARMER_CPF);
            });

            When(farmer => !string.IsNullOrWhiteSpace(farmer.SpouseName), () =>
            {
                RuleFor(farmer => farmer.SpouseCpf)
                    .NotEmpty()
                    .WithMessage(ResourceMessagesException.SPOUSE_CPF_REQUIRED);

                RuleFor(farmer => farmer.SpouseName)
                .Must(name => name!.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_SPOUSE_NAME)
                .Matches(TextOnlyRegex)
                    .WithMessage(ResourceMessagesException.NAME_SPOUSE_WITH_SPECIAL_CHARACTERES)
                .Must((request, spouseName) =>
                {
                    return !spouseName.Trim().Equals(request.Name.Trim(), StringComparison.CurrentCultureIgnoreCase);
                })
                    .WithMessage(ResourceMessagesException.SPOUSE_NAME_SAME_AS_FARMER);
            });

            RuleFor(farmer => farmer.BirthDate)
                .NotEmpty()
                    .WithMessage(ResourceMessagesException.BIRTH_DATE_EMPTY)
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
                    .WithMessage(ResourceMessagesException.INVALID_BIRTH_DATE)
                .Must(date => date <= DateOnly.FromDateTime(DateTime.Today).AddYears(-18))
                    .WithMessage(ResourceMessagesException.UNDERAGE_FARMER);

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