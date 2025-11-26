using LaborUnion.Domain.Entities;

namespace LaborUnion.Domain.Security.Tokens
{
    public interface IAccessTokenGenerate
    {
        string Generate(User user);
    }
}
