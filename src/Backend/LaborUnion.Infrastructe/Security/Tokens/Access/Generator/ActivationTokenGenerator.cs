using LaborUnion.Domain.Security.Tokens;
using System.Security.Cryptography;

namespace LaborUnion.Infrastructe.Security.Tokens.Access.Generator
{
    public class ActivationTokenGenerator : IActivationTokenGenerator
    {
        public string Generate() => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    }
}
