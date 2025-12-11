using LaborUnion.Domain.Dtos;

namespace LaborUnion.Domain.Repositories.Farmer
{
    public interface IFarmerReadOnlyRepository
    {
        Task<bool> ExistActiveFarmerWithCpf(string cpf);
        Task<bool> ExistActiveFarmerWithRegistration(string registration);
        Task<bool> ExistActiveFarmerWithEmail(string email);
        Task<bool> ExistActiveFarmerWithSpouseCpf(string spouseCpf);
        Task<Entities.Farmer?> GetById(int id);
        Task<Entities.Farmer?> GetByCpf(string cpf);
        Task<IList<Entities.Farmer>> Filter(FilterFarmerDto filters);
        Task<int> CountTotalFarmers();
        Task<int> CountFarmersByCity(string city);
        Task<int> CountFarmersRegisteredInTheLastMonth();
    }
}
