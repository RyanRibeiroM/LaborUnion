using AutoMapper;
using LaborUnion.Communication.Reponses;
using LaborUnion.Communication.Requests;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Security.Tokens;
using LaborUnion.Exceptions;

namespace LaborUnion.Application.UseCases.User.Register
{
    public class RegisterUserUseCase: IRegisterUserUseCase
    {
        private readonly IUserWriteOnlyRepository _writeOnlyRepository;
        private readonly IUserReadOnlyRepository _readOnlyRepository;
        public readonly IPasswordEncrypter _passwordEncrypter;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAccessTokenGenerate _accessTokenGenerate;

        public RegisterUserUseCase(IUserWriteOnlyRepository writeOnlyRepository, IUserReadOnlyRepository readOnlyRepository, IPasswordEncrypter passwordEncrypter, IMapper mapper, IUnitOfWork unitOfWork, IAccessTokenGenerate accessTokenGenerate)
        {
            _writeOnlyRepository = writeOnlyRepository;
            _readOnlyRepository = readOnlyRepository;
            _passwordEncrypter = passwordEncrypter;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _accessTokenGenerate = accessTokenGenerate;
        }

        public async Task<ResponseRegisteredUserJson> Execute(RequestRegisterUserJson request)
        {
            await Validate(request);
            var user = _mapper.Map<Domain.Entities.User>(request);

            user.Password = _passwordEncrypter.Encrypt(request.Password);

            user.Role = Domain.Enums.UserRoles.Administrator;
            user.UserIdentifier = Guid.NewGuid();

            var token = _accessTokenGenerate.Generate(user);

            await _writeOnlyRepository.AddAsync(user);
            await _unitOfWork.Commit();


            return new ResponseRegisteredUserJson { 
                Name = user.Name,
                Token = token
            };

        }

        private async Task Validate(RequestRegisterUserJson request)
        {
            var validator = new RegisterUserValidator();
            var result = await validator.ValidateAsync(request);

            var emailExists = await _readOnlyRepository.ExistWithEmailAsync(request.Email);
            if (emailExists)
                result.Errors.Add(new FluentValidation.Results.ValidationFailure("email", ResourceMessagesException.EMAIL_ALREADY_EXISTS));

            if (!result.IsValid)
            {
                var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new ErrorOnValidationException(errorMessages);
            }
        }
    }
}
