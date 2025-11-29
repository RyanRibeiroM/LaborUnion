namespace LaborUnion.Domain.Repositories.Farmer
{
    public interface IFarmerWriteOnlyRepository
    {
        Task Add(Entities.Farmer farmer);
        Task Delete(int id);
    }
}
