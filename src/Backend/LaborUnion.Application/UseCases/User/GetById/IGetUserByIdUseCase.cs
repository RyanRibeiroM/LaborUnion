using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.User.GetById
{
    public interface IGetUserByIdUseCase
    {
        public Task<ResponseUserJson> Execute(int id);
    }
}
