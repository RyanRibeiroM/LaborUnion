namespace LaborUnion.Infrastructe.Migrations
{
    public abstract class DataBaseVersions
    {
        public const int TABLE_USER_AND_FARMER = 1;
        public const int SPOUSE_AND_IS_ALIVE_COLUMNS_IN_THE_FARMER_TABLE = 2;
        public const int BIRTH_DATE_COLUMN_IN_THE_FARMER_TABLE = 3;
        public const int SERVICE_TYPE_TABLE = 4;
        public const int MAKE_ADDRESS_REFERENCE_NULLABLE = 5;
        public const int REFRESH_TOKEN_TABLE = 6;
    }
}
