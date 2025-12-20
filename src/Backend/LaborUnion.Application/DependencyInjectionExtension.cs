using LaborUnion.Application.Services.Mapper;
using LaborUnion.Application.UseCases.Farmer.Delete;
using LaborUnion.Application.UseCases.Farmer.Filter;
using LaborUnion.Application.UseCases.Farmer.GetById;
using LaborUnion.Application.UseCases.Farmer.Register;
using LaborUnion.Application.UseCases.Farmer.Update;
using LaborUnion.Application.UseCases.Login.DoLogin;
using LaborUnion.Application.UseCases.Sector.AddUser;
using LaborUnion.Application.UseCases.Sector.Delete;
using LaborUnion.Application.UseCases.Sector.Filter;
using LaborUnion.Application.UseCases.Sector.GetById;
using LaborUnion.Application.UseCases.Sector.Register;
using LaborUnion.Application.UseCases.Sector.RemovePermission;
using LaborUnion.Application.UseCases.Sector.Update;
using LaborUnion.Application.UseCases.Service.Delete;
using LaborUnion.Application.UseCases.Service.Filter;
using LaborUnion.Application.UseCases.Service.GetById;
using LaborUnion.Application.UseCases.Service.Register;
using LaborUnion.Application.UseCases.Service.Update;
using LaborUnion.Application.UseCases.ServiceType.Delete;
using LaborUnion.Application.UseCases.ServiceType.Filter;
using LaborUnion.Application.UseCases.ServiceType.GetById;
using LaborUnion.Application.UseCases.ServiceType.Register;
using LaborUnion.Application.UseCases.ServiceType.Resgister;
using LaborUnion.Application.UseCases.Token.RefreshToken;
using LaborUnion.Application.UseCases.User.Profile;
using LaborUnion.Application.UseCases.User.Register;
using Microsoft.Extensions.DependencyInjection;
namespace LaborUnion.Application
{
    public static class DependencyInjectionExtension
    {
        public static void AddApplication(this IServiceCollection services)
        {
            AddAutoMapper(services);
            AddUseCases(services);
        }
        private static void AddAutoMapper(IServiceCollection services)
        {
            services.AddAutoMapper(cfg => cfg.AddProfile<AutoMapping>());
        }

        private static void AddUseCases(IServiceCollection services)
        {
            services.AddScoped<IDoLoginUseCase, DoLoginUseCase>();

            services.AddScoped<IRegisterUserUseCase, RegisterUserUseCase>();
            services.AddScoped<IGetUserProfileUseCase, GetUserProfileUseCase>();

            services.AddScoped<IRegisterFarmerUseCase, RegisterFarmerUseCase>();
            services.AddScoped<IUpdateFarmerUseCase, UpdateFarmerUseCase>();
            services.AddScoped<IFilterFarmerUseCase, FilterFarmerUseCase>();
            services.AddScoped<IDeleteFarmerUseCase, DeleteFarmerUseCase>();
            services.AddScoped<IGetFarmerByIdUseCase, GetFarmerByIdUseCase>();

            services.AddScoped<IRegisterServiceTypeUseCase, RegisterServiceTypeUseCase>();
            services.AddScoped<IGetServiceTypeByIdUseCase, GetServiceTypeByIdUseCase>();
            services.AddScoped<IFilterServiceTypeUseCase, FilterServiceTypeUseCase>();
            services.AddScoped<IDeleteServiceTypeUseCase, DeleteServiceTypeUseCase>();

            services.AddScoped<IRegisterSectorUseCase, RegisterSectorUseCase>();
            services.AddScoped<IGetSectorByIdUseCase, GetSectorByIdUseCase>();
            services.AddScoped<IDeleteSectorUseCase, DeleteSectorUseCase>();
            services.AddScoped<IUpdateSectorUseCase, UpdateSectorUseCase>();
            services.AddScoped<IRegisterUserToSectorUseCase, RegisterUserToSectorUseCase>();
            services.AddScoped<IFilterSectorUseCase, FilterSectorUseCase>();
            services.AddScoped<IRemovePermissionUserToSectorUseCase, RemovePermissionUserToSectorUseCase>();

            services.AddScoped<IUserRefreshTokenUseCase, UserRefreshTokenUseCase>();

            services.AddScoped<IRegisterServiceUseCase, RegisterServiceUseCase>();
            services.AddScoped<IGetServiceByIdUseCase, GetServiceByIdUseCase>();
            services.AddScoped<IFilterServiceUseCase, FilterServiceUseCase>();
            services.AddScoped<IDeleteServiceUseCase, DeleteServiceUseCase>();
            services.AddScoped<IUpdateServiceUseCase, UpdateServiceUseCase>();

        }
    }
}
