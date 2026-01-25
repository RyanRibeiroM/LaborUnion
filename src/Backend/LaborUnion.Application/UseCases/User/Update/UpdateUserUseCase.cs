using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.User.Update
{
    public class UpdateUserUseCase : IUpdateUserUseCase
    {
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IUserUpdateOnlyRepository _userUpdateOnlyRepository;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IPasswordEncrypter _passwordEncrypter;
        private readonly ILoggedUser _loggedUser;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserUseCase(
            IFarmerReadOnlyRepository farmerReadOnlyRepository,
            IUserUpdateOnlyRepository userUpdateOnlyRepository,
            IUserReadOnlyRepository userReadOnlyRepository,
            IPasswordEncrypter passwordEncrypter,
            ILoggedUser loggedUser,
            IUnitOfWork unitOfWork)
        {
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _userUpdateOnlyRepository = userUpdateOnlyRepository;
            _userReadOnlyRepository = userReadOnlyRepository;
            _passwordEncrypter = passwordEncrypter;
            _loggedUser = loggedUser;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(int id, RequestUpdateUserJson request)
        {
            var user = await _userUpdateOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);
            var loggedUser = await _loggedUser.GetUser();
            await Validate(request, user, loggedUser);

            user.Name = request.Name;
            user.Email = request.Email;

            if(user.Role != UserRoles.Developer)
                user.Role = (UserRoles)request.Role;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                user.Password = _passwordEncrypter.Encrypt(request.Password);
            }

            _userUpdateOnlyRepository.Update(user);
            await _unitOfWork.Commit();
        }

        private async Task Validate(RequestUpdateUserJson request, Domain.Entities.User user, Domain.Entities.User loggedUser)
        {
            var validator = new UpdateUserValidator();
            var result = validator.Validate(request);

            if ((int)request.Role == (int)UserRoles.Developer)
                throw new NotFoundException(ResourceMessagesException.USER_ROLE_NOT_SUPPORTED);
            else if (Enum.IsDefined(typeof(PrivilegedUserRoles), (int)request.Role) && loggedUser.Role == UserRoles.Administrator)
                throw new NotFoundException(ResourceMessagesException.USER_ROLE_NOT_SUPPORTED);

            if (request.Email != user.Email)
            {
                var emailExistsInFarmers = user.Email != request.Email && await _farmerReadOnlyRepository.ExistActiveFarmerWithEmail(request.Email);

                var emailExistsInUsers = user.Email != request.Email && await _userReadOnlyRepository.ExistActiveUserWithEmailAsync(request.Email);

                if (emailExistsInFarmers || emailExistsInUsers)
                {
                    result.Errors.Add(new FluentValidation.Results.ValidationFailure(nameof(request.Email), ResourceMessagesException.EMAIL_ALREADY_EXISTS));
                }
            }

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
