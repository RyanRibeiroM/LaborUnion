namespace LaborUnion.Application.UseCases.Sector.RemovePermission
{
    public interface IRemovePermissionUserToSectorUseCase
    {
        public Task Execute(int sectorId, int userId);
    }
}
