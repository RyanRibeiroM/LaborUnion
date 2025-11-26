using LaborUnion.Domain.Security.Tokens;
using System.Security.Cryptography;

namespace LaborUnion.Infrastructure.Security.Tokens
{
    public class ActivationTokenGenerator : IActivationTokenGenerator
    {
        public string Generate() => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    }
}
