using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShawnLink;

Host.CreateDefaultBuilder(args)
  .ConfigureWebHostDefaults(bldr =>
  {

    bldr.ConfigureServices(svc =>
    {
      svc.AddTransient<LinkManager>();
      svc.AddMemoryCache();
    });

    bldr.ConfigureAppConfiguration((hostingContext, config) =>
    {
      config.AddJsonFile("config.json", true)
        .AddUserSecrets(Assembly.GetExecutingAssembly())
        .AddEnvironmentVariables();
    });

    bldr.Configure(app =>
    {
      app.UseStaticFiles();

      app.Run(async context =>
        {
          var manager = app.ApplicationServices.GetService<LinkManager>();
          await manager.HandleRedirection(context);
        });
    });

  })
  .Start();
