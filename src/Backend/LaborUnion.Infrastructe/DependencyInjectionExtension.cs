using FluentMigrator.Runner;
using LaborUnion.Domain.Repositories;
using LaborUnion.Domain.Repositories.Document;
using LaborUnion.Domain.Repositories.Farmer;
using LaborUnion.Domain.Repositories.Sector;
using LaborUnion.Domain.Repositories.Services;
using LaborUnion.Domain.Repositories.ServiceType;
using LaborUnion.Domain.Repositories.Token;
using LaborUnion.Domain.Repositories.User;
using LaborUnion.Domain.Security.Criptography;
using LaborUnion.Domain.Security.Tokens;
using LaborUnion.Domain.Services.LoggedUser;
using LaborUnion.Infrastructe.DataAccess;
using LaborUnion.Infrastructe.DataAccess.Repositories;
using LaborUnion.Infrastructe.Security.Tokens.Access.Generator;
using LaborUnion.Infrastructe.Security.Tokens.Refresh;
using LaborUnion.Infrastructure.DataAccess;
using LaborUnion.Infrastructure.DataAccess.Repositories;
using LaborUnion.Infrastructure.Extensions;
using LaborUnion.Infrastructure.Security.Criptography;
using LaborUnion.Infrastructure.Services.LoggedUser;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LaborUnion.Infrastructe
{
    public static class DependencyInjectionExtension
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            AddPasswordEncript(services);
            AddDbContext(services, configuration);
            AddRepositories(services);
            AddFluentMigrator(services, configuration);
            AddTokens(services, configuration);
            AddLoggedUser(services);

        }
        public static void AddDbContext(IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<LaborUnionDbContext>(options => options.UseSqlServer(connectionString));
        }

        private static void AddFluentMigrator(IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.ConnectionString();

            services.AddFluentMigratorCore().ConfigureRunner(options =>
            {
                options
                .AddSqlServer()
                .WithGlobalConnectionString(connectionString)
                .ScanIn(typeof(LaborUnionDbContext).Assembly).For.All();
            });
        }

        public static void AddRepositories(IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddScoped<IUserReadOnlyRepository, UserRepository>();
            services.AddScoped<IUserUpdateOnlyRepository, UserRepository>();
            services.AddScoped<IUserWriteOnlyRepository, UserRepository>();

            services.AddScoped<IUserWriteOnlyRepository, UserRepository>();
            services.AddScoped<IFarmerReadOnlyRepository, FarmerRepository>();
            services.AddScoped<IFarmerWriteOnlyRepository, FarmerRepository>();
            services.AddScoped<IFarmerUpdateOnlyRepository, FarmerRepository>();

            services.AddScoped<IServiceTypeReadOnlyRepository, ServiceTypeRepository>();
            services.AddScoped<IServiceTypeWriteOnlyRepository, ServiceTypeRepository>();
            services.AddScoped<IServiceTypeUpdateOnlyRepository, ServiceTypeRepository>();

            services.AddScoped<IServiceReadOnlyRepository, ServiceRepository>();
            services.AddScoped<IServiceWriteOnlyRepository, ServiceRepository>();
            services.AddScoped<IServiceUpdateOnlyRepository, ServiceRepository>();

            services.AddScoped<ISectorReadOnlyRepository, SectorRepository>();
            services.AddScoped<ISectorWriteOnlyRepository, SectorRepository>();
            services.AddScoped<ISectorUpdateOnlyRepository, SectorRepository>();

            services.AddScoped<IDocumentReadOnlyRepository, DocumentRepository>();
            services.AddScoped<IDocumentWriteOnlyRepository, DocumentRepository>();
            services.AddScoped<IDocumentUpdateOnlyRepository, DocumentRepository>();

            services.AddScoped<ITokenRepository, TokenRepository>();
            services.AddScoped<IRefreshTokenGenerator, RefreshTokenGenerator>();
        }

        private static void AddPasswordEncript(IServiceCollection services)
        {
            services.AddScoped<IPasswordEncrypter, BCryptPasswordEncrypter>();
        }

        private static void AddTokens(IServiceCollection services, IConfiguration configuration)
        {
            var expirationInMinutes = uint.Parse(configuration.GetSection("Jwt:ExpirationInMinutes").Value!);
            var securityKey = configuration.GetSection("Jwt:Secret").Value!;

            services.AddScoped<IAccessTokenGenerate>(option => new JwtTokenGenerator(expirationInMinutes, securityKey));
            services.AddScoped<IActivationTokenGenerator, ActivationTokenGenerator>();
        }
        private static void AddLoggedUser(IServiceCollection services)
        {
            services.AddScoped<ILoggedUser, LoggedUser>();
        }
    }
}
