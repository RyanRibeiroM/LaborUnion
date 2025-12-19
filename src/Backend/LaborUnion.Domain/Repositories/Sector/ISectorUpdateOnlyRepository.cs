namespace LaborUnion.Domain.Repositories.Sector
{
    public interface ISectorUpdateOnlyRepository
    {
        Task<Entities.Sector?> GetById(int id);
        void Update(Entities.Sector sector);
    }
}
