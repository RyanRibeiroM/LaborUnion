namespace LaborUnion.Communication.Responses
{
    public class ResponseAccountantsJson
    {
        public int NumberOfServicesProvided { get; set; }
        public int NumberOfServicesProvidedThisMonth { get; set; }
        public int NumberOfExpiredDocuments { get; set; }
        public int NumberOfDocumentsExpiringThisMonth { get; set; }
        public int NumberOfFarmers { get; set; }
        public int NumberOfFarmersRegisteredThisMonth { get; set; }
    }
}
