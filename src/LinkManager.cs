using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ShawnLink
{
  public class LinkManager
  {
    private const string PARTITIONKEY = "shawnlink";
    private const string LINKCACHE = "LINKCACHE";
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LinkManager> _logger;
    private readonly IMemoryCache _cache;
    private string _connectionString;
    private CloudStorageAccount _account;
    private CloudTableClient _tableClient;
    private CloudTable _table;

    public LinkManager(IConfiguration config, 
      IWebHostEnvironment env,
      ILogger<LinkManager> logger,
      IMemoryCache cache)
    {
      _connectionString = config["Storage:ConnectionString"];
      _account = CloudStorageAccount.Parse(_connectionString);
      _tableClient = _account.CreateCloudTableClient();
      _table = _tableClient.GetTableReference("links");
      _env = env;
      _logger = logger;
      _cache = cache;
    }

    public async Task HandleRedirection(HttpContext ctx)
    {
      try
      {
        var redirect = await FindRedirect(ctx.Request.Path);
        if (redirect is not null)
        {
          ctx.Response.Redirect(redirect);
          return;
        }
      }
      catch (Exception ex)
      {
        _logger.LogError("Exception during finding short link", ex);
      }

      // Default to index.html
      _logger.LogWarning($"Link not found: {ctx.Request.Path}");
      ctx.Response.ContentType = "text/html";
      await ctx.Response.WriteAsync(await File.ReadAllTextAsync(Path.Combine(_env.ContentRootPath, "index.html")));
    }

    async Task<string> FindRedirect(PathString path)
    {
      var key = path.Value.ToLower().Substring(1); // Remove leading slash
      if (!string.IsNullOrWhiteSpace(key))
      {
        
        Dictionary<string, string> linkCache;

        if (_cache.TryGetValue<Dictionary<string, string>>(LINKCACHE, out linkCache))
        {
          if (linkCache.ContainsKey(key))
          {
            _logger.LogInformation("Found key from cache");
            return linkCache[key];
          }
        }

        // Look it up
        var op = TableOperation.Retrieve<LinkEntity>(PARTITIONKEY, key);
        var result = await _table.ExecuteAsync(op);
        var link = result.Result as LinkEntity;
        if (link != null)
        {
          if (linkCache is null) linkCache = new Dictionary<string, string>();
          linkCache[key] = link.Link;
          _cache.Set(LINKCACHE, linkCache, DateTimeOffset.Now.AddMinutes(60));

          _logger.LogInformation("Added Key to Cache");

          return link.Link;
        }
      }
      return null;
    }
  }
}