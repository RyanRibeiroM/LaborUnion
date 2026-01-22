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
        public const int SERVICE_TABLE = 7;
        public const int ADD_MARITAL_STATUS_AND_OCCUPATION_TO_THE_FARMERS_TABLE = 8;
        public const int ADD_SERVICE_STATUS = 9;
        public const int SECTOR_TABLE = 10;
        public const int ADD_SECTOR_ID_IN_THE_SERVICE_TYPE_TABLE = 11;
        public const int DOCUMENT_TABLE = 12;
        public const int ADD_DEFAULT_USER = 13;
    }
}
