using idunno.Authentication.Basic;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

var config = new ShawnConfiguration(builder.Configuration);

builder.Services.AddSingleton(config);

builder.Services.AddAuthentication(BasicAuthenticationDefaults.AuthenticationScheme)
   .AddBasic(ConfigureBasicAuth);

builder.Services.AddTransient<LinkManager>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IAccumulatorQueue, AccumulatorQueue>();
builder.Services.AddControllersWithViews();
builder.Services.AddTransient<ILinkRepository, LinkRepository>();
builder.Services.AddHostedService<AccumulatorBackgroundService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();

app.Use(async (context, next) =>
{
  var manager = app.Services.GetService<LinkManager>();
  if (!await manager.HandleRedirection(context)) await next();
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute("Admin", "/admin", new { controller = "Admin", action = "Index" });
app.MapFallbackToController("Index", "Fallback");

app.Run();


void ConfigureBasicAuth(BasicAuthenticationOptions options)
{
  options.Realm = "shawnl.ink";
  options.AllowInsecureProtocol = true;
  options.Events = new BasicAuthenticationEvents
  {
    OnValidateCredentials = context =>
    {
      if (context.Username == config.Security.Username && context.Password == config.Security.Password)
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
  options.Validate();
}