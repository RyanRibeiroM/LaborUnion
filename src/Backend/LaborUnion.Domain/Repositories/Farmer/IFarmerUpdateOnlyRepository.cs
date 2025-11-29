namespace LaborUnion.Domain.Repositories.Farmer
{
    public interface IFarmerUpdateOnlyRepository
    {
        Task<Entities.Farmer?> GetById(int id);
        void Update(Entities.Farmer farmer);
    }
}
