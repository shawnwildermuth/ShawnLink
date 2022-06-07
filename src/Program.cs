using System.IO;
using System.Text.Json;
using idunno.Authentication.Basic;
using Microsoft.Extensions.DependencyInjection;
using ShawnLink.Data;

var builder = WebApplication.CreateBuilder(args);

var config = new ShawnConfiguration(builder.Configuration);

builder.Services.AddSingleton(config);

builder.Services.AddAuthentication(BasicAuthenticationDefaults.AuthenticationScheme)
   .AddBasic(ConfigureBasicAuth);

builder.Services.AddTransient<LinkManager>();
builder.Services.AddMemoryCache();
builder.Services.AddSingleton<IAccumulatorQueue, AccumulatorQueue>();
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<ILinkRepository, LinkRepository>();
builder.Services.AddHostedService<AccumulatorBackgroundService>();
builder.Services.AddDbContext<LinkContext>();


var app = builder.Build();

if (args is not null && args.Count() == 1 && args[0] == "/seed")
{
  // ...
  var json = File.ReadAllText("./links.json");
  var opt = new JsonSerializerOptions();
  opt.PropertyNameCaseInsensitive = true;
  var links = JsonSerializer.Deserialize<Link[]>(json, opt);
  using var scope = app.Services.CreateScope();
  var ctx = scope.ServiceProvider.GetService<LinkContext>();
  ctx.AddRange(links);
  ctx.SaveChanges();
  return;
}

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute("Admin", "/admin", new { controller = "Admin", action = "Index" });

app.Use(async (context, next) =>
{
  using var scope = app.Services.CreateScope();
  var manager = scope.ServiceProvider.GetService<LinkManager>();
  if (!await manager.HandleRedirection(context)) await next();
});


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