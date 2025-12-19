using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;

namespace LaborUnion.Application.Utils
{
    public static class CepUtils
    {

        public static string Format(string cep)
        {
            if (string.IsNullOrWhiteSpace(cep))
                return cep;

            var digits = new string([.. cep.Where(char.IsDigit)]);

            if (digits.Length != 8)
                return cep;

            if (Regex.IsMatch(cep, @"^\d{5}-\d{3}$"))
                return cep;

            return Convert.ToUInt32(digits).ToString(@"00000\-000");
        }
        public static bool IsValideCep(string cep)
        {
            if (string.IsNullOrWhiteSpace(cep))
                return false;

            var digits = new string([.. cep.Where(char.IsDigit)]);

            if (digits.Length != 8)
                return false;

            return true;
        }
    }
}
