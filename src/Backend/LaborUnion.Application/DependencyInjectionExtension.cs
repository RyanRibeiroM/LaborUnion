using LaborUnion.Application.Services.Mapper;
using LaborUnion.Application.UseCases.Login.DoLogin;
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
        }
    }
}
