using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ShawnLink;

Host.CreateDefaultBuilder(args)
  .ConfigureWebHostDefaults(bldr =>
  {
    bldr.ConfigureAppConfiguration((hostingContext, config) =>
    {
      config.Sources.Clear();
      config.AddJsonFile("config.json", true)
        .AddUserSecrets(Assembly.GetExecutingAssembly())
        .AddEnvironmentVariables();
    });

    bldr.UseStartup<Startup>();
  })
  .Build()
  .Run();
