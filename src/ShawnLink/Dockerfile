FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ShawnLink.csproj", ""]
RUN dotnet restore "./ShawnLink.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ShawnLink.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ShawnLink.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ShawnLink.dll", "--urls=http://+:80"]