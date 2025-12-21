
using LaborUnion.Domain.Enums;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.User.Delete
{
    public class DeleteUserUseCase : IDeleteUserUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserReadOnlyRepository _userReadOnlyRepository;
        private readonly IUserWriteOnlyRepository _userWriteOnlyRepository;

        public DeleteUserUseCase(IUnitOfWork unitOfWork, IUserReadOnlyRepository userReadOnlyRepository, IUserWriteOnlyRepository userWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _userReadOnlyRepository = userReadOnlyRepository;
            _userWriteOnlyRepository = userWriteOnlyRepository;
        }

        public async Task Execute(int id)
        {
            var user = await _userReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            if (Enum.IsDefined(typeof(PrivilegedUserRoles), (int)user.Role))
                throw new NotFoundException(ResourceMessagesException.USER_NOT_FOUND);

            await _userWriteOnlyRepository.Delete(user.Id);

            await _unitOfWork.Commit();
        }
    }
}
