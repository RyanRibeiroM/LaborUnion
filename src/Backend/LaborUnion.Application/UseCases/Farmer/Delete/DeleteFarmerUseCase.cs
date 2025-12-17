
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Exceptions;
using LaborUnion.Exceptions.ExceptionsBase;

namespace LaborUnion.Application.UseCases.Farmer.Delete
{
    public class DeleteFarmerUseCase : IDeleteFarmerUseCase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFarmerReadOnlyRepository _farmerReadOnlyRepository;
        private readonly IFarmerWriteOnlyRepository _farmerWriteOnlyRepository;

        public DeleteFarmerUseCase(IUnitOfWork unitOfWork, IFarmerReadOnlyRepository farmerReadOnlyRepository, IFarmerWriteOnlyRepository farmerWriteOnlyRepository)
        {
            _unitOfWork = unitOfWork;
            _farmerReadOnlyRepository = farmerReadOnlyRepository;
            _farmerWriteOnlyRepository = farmerWriteOnlyRepository;
        }

        public async Task Execute(int id)
        {
            var farmer = await _farmerReadOnlyRepository.GetById(id) ?? throw new NotFoundException(ResourceMessagesException.FARMER_NOT_FOUND);

            await _farmerWriteOnlyRepository.Delete(farmer.Id);

            await _unitOfWork.Commit();
        }
    }
}
