using LaborUnion.Domain.Repositories.Token;
using System.Security.Cryptography;

namespace LaborUnion.Infrastructe.Security.Tokens.Refresh
{
    public class RefreshTokenGenerator : IRefreshTokenGenerator
    {
        public string Generate()
        {
            var randomNumber = RandomNumberGenerator.GetBytes(32);

            return Convert.ToBase64String(randomNumber);
        }
    }
}
