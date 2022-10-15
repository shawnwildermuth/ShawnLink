using System.IO;
using System.Text.Json;
using idunno.Authentication.Basic;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph.ExternalConnectors;
using Microsoft.Identity.Web;
using ShawnLink.Data;

var builder = WebApplication.CreateBuilder(args);

var config = new ShawnConfiguration(builder.Configuration);

builder.Services.AddSingleton(config);

builder.Services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
  .AddMicrosoftIdentityWebApp(builder.Configuration.GetSection("AzureAd"));

// Configure for inside of a container
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
  options.ForwardedHeaders = ForwardedHeaders.XForwardedFor |
                ForwardedHeaders.XForwardedProto;
  // Only loopback proxies are allowed by default.
  // Clear that restriction because forwarders are enabled by explicit
  // configuration.
  options.KnownNetworks.Clear();
  options.KnownProxies.Clear();
});

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
  ctx.Database.EnsureCreated();
  ctx.AddRange(links);
  ctx.SaveChanges();
  return;
}

app.UseForwardedHeaders();

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

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