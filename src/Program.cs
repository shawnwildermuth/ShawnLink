using System.Reflection;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ShawnLink;

WebHost.CreateDefaultBuilder(args)
  .ConfigureAppConfiguration((hostingContext, config) =>
  {
    config.Sources.Clear();
    config.AddJsonFile("config.json", true)
      .AddUserSecrets(Assembly.GetExecutingAssembly())
      .AddEnvironmentVariables();
  })
  .UseStartup<Startup>()
  .Build()
  .Run();
