using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ShawnLink.Configuration;

namespace ShawnLink.Services
{
  public class LinkManager
  {
    private const string PARTITIONKEY = "shawnlink";
    private const string LINKCACHE = "LINKCACHE";
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LinkManager> _logger;
    private readonly IMemoryCache _cache;
    private readonly TableRequestOptions _tableRequestOptions;
    private string _connectionString;
    private CloudStorageAccount _account;
    private CloudTableClient _tableClient;
    private CloudTable _table;

    public LinkManager(ShawnConfiguration config,
      IWebHostEnvironment env,
      ILogger<LinkManager> logger,
      IMemoryCache cache)
    {
      _connectionString = config.Storage.ConnectionString;
      _account = CloudStorageAccount.Parse(_connectionString);
      _tableClient = _account.CreateCloudTableClient();
      _table = _tableClient.GetTableReference("links");
      _env = env;
      _logger = logger;
      _cache = cache;
      _tableRequestOptions = new TableRequestOptions() { ConsistencyLevel = ConsistencyLevel.Eventual };
     }

    public Task<IEnumerable<LinkEntity>> GetAll()
    {

      return Task.FromResult(_table.CreateQuery<LinkEntity>().Execute(_tableRequestOptions));
    }

    public async Task<LinkEntity> InsertLink(string key, string url)
    {
      var oldLink = _table.CreateQuery<LinkEntity>()
        .Where(l => l.PartitionKey == PARTITIONKEY && l.RowKey == key)
        .FirstOrDefault();

      if (oldLink is not null)
      {
        _logger.LogWarning("Duplicate Key Specified");
        return null;
      }

      var entity = new LinkEntity() { PartitionKey = PARTITIONKEY, RowKey = key, Link = url };
      var op = TableOperation.Insert(entity);
      var result =  await _table.ExecuteAsync(op);
      return result.Result as LinkEntity;
    }

    public async Task<LinkEntity> UpdateLink(string key, string url)
    {
      var oldLink = _table.CreateQuery<LinkEntity>()
        .Where(l => l.PartitionKey == PARTITIONKEY && l.RowKey == key)
        .FirstOrDefault();

      if (oldLink is null) return null;

      oldLink.Link = url;
      var op = TableOperation.Merge(oldLink);
      var result = await _table.ExecuteAsync(op);
      return result.Result as LinkEntity;
    }

    public async Task<bool> DeleteLink(string key)
    {
      var oldLink = _table.CreateQuery<LinkEntity>()
        .Where(l => l.PartitionKey == PARTITIONKEY && l.RowKey == key)
        .FirstOrDefault();

      if (oldLink is null) return false;

      var op = TableOperation.Delete(oldLink);
      var result = await _table.ExecuteAsync(op);
     
      return result.HttpStatusCode >= 200 && result.HttpStatusCode < 300;
    }

    public void ClearCache()
    {
      _cache.Remove(LINKCACHE);
    }

    public async Task<bool> HandleRedirection(HttpContext ctx)
    {
      try
      {
        var redirect = await FindRedirect(ctx.Request.Path);
        if (redirect is not null)
        {
          ctx.Response.Redirect(redirect);
          return true;
        }
      }
      catch (Exception ex)
      {
        _logger.LogError("Exception during finding short link", ex);
      }

      return false;

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