using LaborUnion.Application.UseCases.User.Update;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.User.UpdateProfile
{
    public class UpdateUserProfileUseCase : IUpdateUserProfileUseCase
    {
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IUserUpdateOnlyRepository _userUpdateOnlyRepository;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IPasswordEncrypter _passwordEncrypter;
        private readonly ILoggedUser _loggedUser;
        private readonly IUnitOfWork _unitOfWork;
        public UpdateUserProfileUseCase(
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
            _loggedUser = loggedUser;
            _passwordEncrypter = passwordEncrypter;
            _unitOfWork = unitOfWork;
        }
        public async Task Execute(RequestUpdateUserProfileJson request)
        {

            var loggedUser = await _loggedUser.GetUser();

            await Validate(request, loggedUser);

            loggedUser.Name = request.Name;
            loggedUser.Email = request.Email;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                loggedUser.Password = _passwordEncrypter.Encrypt(request.Password);
            }

            _userUpdateOnlyRepository.Update(loggedUser);
            await _unitOfWork.Commit();
        }

        private async Task Validate(RequestUpdateUserProfileJson request, Domain.Entities.User user)
        {
            var validator = new UpdateUserProfileValidator();
            var result = validator.Validate(request);

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
