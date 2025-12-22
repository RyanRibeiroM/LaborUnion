using LaborUnion.Communication.Responses;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.Services;

namespace LaborUnion.Application.UseCases.Dashboard.Accountant
{
    public class GetDashboardAccountantsUseCase : IGetDashboardAccountantsUseCase
    {
        private readonly IServiceReadOnlyRepository _serviceRepository;
        private readonly IFarmerReadOnlyRepository _farmerRepository;
        private readonly IDocumentReadOnlyRepository _documentRepository;

        public GetDashboardAccountantsUseCase(IServiceReadOnlyRepository serviceRepository, IFarmerReadOnlyRepository farmerRepository, IDocumentReadOnlyRepository documentRepository)
        {
            _serviceRepository = serviceRepository;
            _farmerRepository = farmerRepository;
            _documentRepository = documentRepository;
        }
        public async Task<ResponseAccountantsJson> Execute()
        {
            return new ResponseAccountantsJson()
            {
                NumberOfServicesProvided = await _serviceRepository.CountServicesRegistered(),
                NumberOfServicesProvidedThisMonth = await _serviceRepository.CountServicesRegisteredInTheLastMonth(),
                NumberOfExpiredDocuments = await _documentRepository.CountExpiredDocuments(),
                NumberOfDocumentsExpiringThisMonth = await _documentRepository.CountDocumentsThatExpiredThisMonth(),
                NumberOfFarmers = await _farmerRepository.CountAllFarmers(),
                NumberOfFarmersRegisteredThisMonth =await _farmerRepository.CountFarmersRegisteredInTheLastMonth()
            };

        }
    }
}
