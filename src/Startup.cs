using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using idunno.Authentication.Basic;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ShawnLink.Configuration;
using ShawnLink.Services;

namespace ShawnLink
{
  public class Startup
  {
    private ShawnConfiguration _config;
    private readonly IHostEnvironment _env;

    public Startup(IConfiguration config, IHostEnvironment env)
    {
      _config = new ShawnConfiguration(config);
      _env = env;
    }

    public void ConfigureServices(IServiceCollection svc)
    {

      svc.AddSingleton(_config);

      //svc.AddAuthentication(BasicAuthenticationDefaults.AuthenticationScheme)
      //   .AddBasic(ConfigureBasicAuth);

      svc.AddAutoMapper(Assembly.GetEntryAssembly());
      svc.AddTransient<LinkManager>();
      svc.AddMemoryCache();
      svc.AddControllersWithViews();
    }

    public void Configure(IApplicationBuilder app)
    {
      if (_env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseHttpsRedirection();
      }

      app.Use(async (context, next) =>
      {
        var manager = app.ApplicationServices.GetService<LinkManager>();
        if (!await manager.HandleRedirection(context)) await next();
      });

      app.UseStaticFiles();

      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(bldr =>
      {
        bldr.MapControllerRoute("Admin", "/admin", new { controller = "Admin", action = "Index" });
        bldr.MapFallbackToController("Index", "Fallback");
      });
    }

    void ConfigureBasicAuth(BasicAuthenticationOptions options)
    {
      options.Realm = "shawnl.ink";
      options.Events = new BasicAuthenticationEvents
      {
        OnValidateCredentials = context =>
        {
          if (context.Username == _config.Security.Username && context.Password == _config.Security.Password)
          {
            var claims = new[]
            {
                   new Claim(
                                      ClaimTypes.NameIdentifier,
                                      context.Username,
                                      ClaimValueTypes.String,
                                      context.Options.ClaimsIssuer),
                   new Claim(
                                      ClaimTypes.Name,
                                      context.Username,
                                      ClaimValueTypes.String,
                                      context.Options.ClaimsIssuer)
                 };

            context.Principal = new ClaimsPrincipal(
                new ClaimsIdentity(claims, context.Scheme.Name));

            context.Success();
          }

          return Task.CompletedTask;
        }
      };
    }
  }
}
