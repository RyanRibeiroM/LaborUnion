namespace LaborUnion.Application.UseCases.User.Delete
{
    public interface IDeleteUserUseCase
    {
        public Task Execute(int id);
    }
}
