namespace LaborUnion.Application.Utils
{
    public static class UfUtils
    {
        private static readonly HashSet<string> ValidUfs = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
            "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
            "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
        };

        public static string Format(string uf)
        {
            if (string.IsNullOrWhiteSpace(uf))
                return uf;

            string formatted = uf.Trim().ToUpper();

            if (ValidUfs.Contains(formatted))
                return formatted;

            return uf;
        }

        public static bool IsValidUf(string uf)
        {
            if (string.IsNullOrWhiteSpace(uf))
                return false;

            string cleanUf = uf.Trim();

            return cleanUf.Length == 2 && ValidUfs.Contains(cleanUf);
        }
    }
}