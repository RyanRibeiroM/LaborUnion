using AutoMapper;
using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.Token;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Security.Tokens;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.User.Register
{
    public class RegisterUserUseCase: IRegisterUserUseCase
    {
        private readonly IUserWriteOnlyRepository _writeOnlyRepository;
        private readonly IUserReadOnlyRepository _readOnlyRepository;
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;   
        public readonly IPasswordEncrypter _passwordEncrypter;
        private readonly IMapper _mapper;
        private readonly ILoggedUser _loggedUser;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccessTokenGenerate _accessTokenGenerate;
        private readonly IRefreshTokenGenerator _refreshTokenGenerator;
        private readonly ITokenRepository _tokenRepository;

        public RegisterUserUseCase(IUserWriteOnlyRepository writeOnlyRepository, IUserReadOnlyRepository readOnlyRepository,IFarmerReadOnlyRepository farmerReadOnlyRepository, IPasswordEncrypter passwordEncrypter, IMapper mapper, ILoggedUser loggedUser, IUnitOfWork unitOfWork, IAccessTokenGenerate accessTokenGenerate, IRefreshTokenGenerator refreshTokenGenerator,
            ITokenRepository tokenRepository)
        {
            _writeOnlyRepository = writeOnlyRepository;
            _readOnlyRepository = readOnlyRepository;
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _passwordEncrypter = passwordEncrypter;
            _mapper = mapper;
            _loggedUser = loggedUser;
            _unitOfWork = unitOfWork;
            _accessTokenGenerate = accessTokenGenerate;
            _refreshTokenGenerator = refreshTokenGenerator;
            _tokenRepository = tokenRepository;

        }

        public async Task<ResponseRegisteredUserJson> Execute(RequestRegisterUserJson request)
        {
            var loggedUser = await _loggedUser.GetUser();
            await Validate(request, loggedUser);
            var user = _mapper.Map<Domain.Entities.User>(request);

            user.Password = _passwordEncrypter.Encrypt(request.Password);

            user.Role = UserRoles.Administrator;
            user.UserIdentifier = Guid.NewGuid();

            var token = _accessTokenGenerate.Generate(user);

            await _writeOnlyRepository.AddAsync(user);
            await _unitOfWork.Commit();

            var refreshToken = await CreateAndSaveRefreshToken(user);

            return new ResponseRegisteredUserJson { 
                Name = user.Name,
                Tokens = new ResponseTokensJson
                {
                    AccessToken = token,
                    RefreshToken = refreshToken
                }
            };

        }
        public async Task<string> CreateAndSaveRefreshToken(Domain.Entities.User usuario)
        {
            var refreshToken = new RefreshToken
            {
                Value = _refreshTokenGenerator.Generate(),
                UserId = usuario.Id
            };

            await _tokenRepository.SaveNewRefreshToken(refreshToken);

            await _unitOfWork.Commit();

            return refreshToken.Value;

        }
        private async Task Validate(RequestRegisterUserJson request, Domain.Entities.User loggedUser)
        {
            var validator = new RegisterUserValidator();
            var result = await validator.ValidateAsync(request);

            if ((int)request.Role == (int)UserRoles.Developer)
                throw new NotFoundException(ResourceMessagesException.USER_ROLE_NOT_SUPPORTED);

            else if (Enum.IsDefined(typeof(PrivilegedUserRoles), (int)request.Role) && loggedUser.Role == UserRoles.Administrator) 
                throw new NotFoundException(ResourceMessagesException.USER_ROLE_NOT_SUPPORTED); 

            var emailExists = await _readOnlyRepository.ExistActiveUserWithEmailAsync(request.Email);
            var emailExistsInFarmers = await _farmerReadOnlyRepository.ExistActiveFarmerWithEmail(request.Email);

            if (emailExists || emailExistsInFarmers)
                result.Errors.Add(new FluentValidation.Results.ValidationFailure("email", ResourceMessagesException.EMAIL_ALREADY_EXISTS));

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
