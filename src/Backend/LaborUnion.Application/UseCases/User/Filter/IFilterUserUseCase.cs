using LaborUnion.Communication.Requests;
using LaborUnion.Communication.Responses;

namespace LaborUnion.Application.UseCases.User.Filter
{
    public interface IFilterUserUseCase
    {
        public Task<ResponseUsersJson> Execute(RequestFilterUserJson request);
    }
}
