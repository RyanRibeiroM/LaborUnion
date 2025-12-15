using LaborUnion.Application.Services.Mapper;
using LaborUnion.Application.UseCases.Farmer.Delete;
using LaborUnion.Application.UseCases.Farmer.Filter;
using LaborUnion.Application.UseCases.Farmer.GetById;
using LaborUnion.Application.UseCases.Farmer.Register;
using LaborUnion.Application.UseCases.Farmer.Update;
using LaborUnion.Application.UseCases.Login.DoLogin;
using LaborUnion.Application.UseCases.ServiceType.Delete;
using LaborUnion.Application.UseCases.ServiceType.Filter;
using LaborUnion.Application.UseCases.ServiceType.GetById;
using LaborUnion.Application.UseCases.ServiceType.Register;
using LaborUnion.Application.UseCases.ServiceType.Resgister;
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

            services.AddScoped<IRegisterFarmerUseCase, RegisterFarmerUseCase>();
            services.AddScoped<IUpdateFarmerUseCase, UpdateFarmerUseCase>();
            services.AddScoped<IFilterFarmerUseCase, FilterFarmerUseCase>();
            services.AddScoped<IDeleteFarmerUseCase, DeleteFarmerUseCase>();
            services.AddScoped<IGetFarmerByIdUseCase, GetFarmerByIdUseCase>();

            services.AddScoped<IRegisterServiceTypeUseCase, RegisterServiceTypeUseCase>();
            services.AddScoped<IGetServiceTypeByIdUseCase, GetServiceTypeByIdUseCase>();
            services.AddScoped<IFilterServiceTypeUseCase, FilterServiceTypeUseCase>();
            services.AddScoped<IDeleteServiceTypeUseCase, DeleteServiceTypeUseCase>();
            
        }
    }
}
