using System.Text.RegularExpressions;

namespace LaborUnion.Application.Utils
{
    public static class PhoneUtils
    {
        public static string Format(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return phone;

            if (!IsValidPhoneNumber(phone))
                return phone;

            if (Regex.IsMatch(phone, @"^\(\d{2}\) \d{5}-\d{4}$"))
                return phone;

            if (Regex.IsMatch(phone, @"^\(\d{2}\) \d{4}-\d{4}$"))
                return phone;

            var digits = new string(phone.Where(char.IsDigit).ToArray());

            if (digits.Length == 11)
            {
                return Convert.ToUInt64(digits).ToString(@"(00) 00000-0000");
            }

            if (digits.Length == 10)
            {
                return Convert.ToUInt64(digits).ToString(@"(00) 0000-0000");
            }

            return phone;
        }

        public static bool IsValidPhoneNumber(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return false;

            var digits = new string(phone.Where(char.IsDigit).ToArray());

            if (digits.Length != 10 && digits.Length != 11)
                return false;

            if (digits[0] == '0')
                return false;

            if (digits.Length == 11 && digits[2] != '9')
                return false;

            return true;
        }
    }
}