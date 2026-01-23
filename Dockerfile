FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["LaborUnion.sln", "."]
COPY ["src/Backend/LaborUnion.API/LaborUnion.API.csproj", "src/Backend/LaborUnion.API/"]
COPY ["src/Backend/LaborUnion.Application/LaborUnion.Application.csproj", "src/Backend/LaborUnion.Application/"]
COPY ["src/Backend/LaborUnion.Domain/LaborUnion.Domain.csproj", "src/Backend/LaborUnion.Domain/"]
COPY ["src/Backend/LaborUnion.Infrastructure/LaborUnion.Infrastructure.csproj", "src/Backend/LaborUnion.Infrastructure/"]
COPY ["src/Shared/LaborUnion.Communication/LaborUnion.Communication.csproj", "src/Shared/LaborUnion.Communication/"]
COPY ["src/Shared/LaborUnion.Exceptions/LaborUnion.Exceptions.csproj", "src/Shared/LaborUnion.Exceptions/"]

RUN dotnet restore "LaborUnion.sln"

COPY . .

WORKDIR "/src/src/Backend/LaborUnion.API"
RUN dotnet publish "LaborUnion.API.csproj" -c Release -o /app/publish --no-restore


FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "LaborUnion.API.dll"]