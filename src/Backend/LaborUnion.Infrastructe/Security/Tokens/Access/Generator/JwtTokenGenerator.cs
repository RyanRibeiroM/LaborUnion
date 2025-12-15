using LaborUnion.Domain.Entities;
using LaborUnion.Domain.Security.Tokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LaborUnion.Infrastructe.Security.Tokens.Access.Generator
{
    public class JwtTokenGenerator : IAccessTokenGenerate
    {
        private readonly uint _expirationInMinutes;
        private readonly string _securityKey;

        public JwtTokenGenerator(uint expirationInMinutes, string securityKey)
        {
            _expirationInMinutes = expirationInMinutes;
            _securityKey = securityKey;
        }
        public string Generate(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("UserIdentifier", user.UserIdentifier.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_securityKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "LaborUnionAPI",
                audience: "LaborUnionApp",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_expirationInMinutes),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
