using FluentValidation;
using LaborUnion.Communication.Requests;
using LaborUnion.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaborUnion.Application.UseCases.ServiceType.Update
{
    public class UpdateServiceTypeValidator : AbstractValidator<RequestUpdateServiceTypeJson>
    {
        public UpdateServiceTypeValidator()
        {
            RuleFor(service => service.Name)
                .NotEmpty()
                .Must(name => name.Trim().Length >= 2)
                    .WithMessage(ResourceMessagesException.INVALID_NAME);
        }
    }
}
