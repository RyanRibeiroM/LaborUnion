using LaborUnion.Domain.Security.Criptography;

namespace LaborUnion.Infrastructure.Security.Criptography
{
    public class BCryptPasswordEncrypter : IPasswordEncrypter
    {
        public string Encrypt(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool Verify(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
