using System.Collections.Generic;
using Azure.Cosmos;
using Azure.Cosmos.Serialization;
using Microsoft.Extensions.Logging;

namespace ShawnLink.Services;

public class LinkRepository : ILinkRepository
{
  private const string DBNAME = "ShawnLinks";
  private const string LINKCONTAINERNAME = "links";
  private const string REDIRECTSCONTAINERNAME = "redirects";
  private readonly ShawnConfiguration _config;
  private readonly ILogger<LinkRepository> _logger;
  private readonly IHostEnvironment _enviroment;
  private CosmosClient _client;
  private bool _dbInitialized = false;

  public LinkRepository(ShawnConfiguration config,
    ILogger<LinkRepository> logger,
    IHostEnvironment enviroment)
  {
    _config = config;
    _logger = logger;
    _enviroment = enviroment;

    var connString = _config.Storage.ConnectionString;
    _client = new CosmosClient(_config.Storage.ConnectionString);
  }

  public async Task<IEnumerable<Link>> GetAllLinks()
  {
    var container = await GetLinkContainer();
    var query = new QueryDefinition($"SELECT * FROM c");

    var results = new List<Link>();

    var iterator = container.GetItemQueryIterator<Link>(query);
    await foreach (Link result in iterator)
    {
      results.Add(result);
    }

    return results;
  }

  public async Task<IEnumerable<RedirectSummary>> GetRedirectSummaries()
  {
    var container = await GetRedirectContainer();
    var query = new QueryDefinition(
      @"SELECT COUNT(i) as clickCount, i.key
          FROM i
         GROUP BY i.key");

    var results = new List<RedirectSummary>();

    var iterator = container.GetItemQueryIterator<RedirectSummary>(query);
    await foreach (RedirectSummary result in iterator)
    {
      results.Add(result);
    }

    return results;

  }

  public async Task<Link> GetLink(string key)
  {
    var container = await GetLinkContainer();

    var query = new QueryDefinition("SELECT * FROM c WHERE c.key = @key")
      .WithParameter("@key", key);

    var iterator = container.GetItemQueryIterator<Link>(query);

    var enumerator = iterator.GetAsyncEnumerator();

    if (await enumerator.MoveNextAsync())
    {
      return enumerator.Current;
    }
    else
    {
      // Not Found
      return null;
    }
  }


  public async Task<Link> InsertLink(string key, string url)
  {
    var container = await GetLinkContainer();
    var newItem = await container.CreateItemAsync(new Link() { Key = key, Url = url });
    return newItem.Value;
  }


  public async Task<Link> UpdateLink(string key, string url)
  {
    var container = await GetLinkContainer();
    var link = await GetLink(key);
    if (link is null) return null;
    link.Url = url;
    var result = await container.UpsertItemAsync(link);
    return result.Value;
  }

  public async Task<bool> DeleteLink(string key)
  {
    var item = await GetLink(key);
    if (item is null)
    {
      return false;
    }

    var container = await GetLinkContainer();
    var result = await container.DeleteItemAsync<Link>(item.Id, new PartitionKey(item.Domain));
    return true;
  }

  public async Task<Redirect> InsertRedirect(Redirect redirect)
  {
    var container = await GetRedirectContainer();
    var newItem = await container.CreateItemAsync(redirect);
    return newItem.Value;
  }

  async Task<CosmosContainer> GetLinkContainer()
  {
    await InitializeDatabaseAsync();
    return _client.GetContainer(DBNAME, LINKCONTAINERNAME);
  }

  async Task<CosmosContainer> GetRedirectContainer()
  {
    await InitializeDatabaseAsync();
    return _client.GetContainer(DBNAME, REDIRECTSCONTAINERNAME);
  }

  async Task InitializeDatabaseAsync()
  {
    if (_enviroment.IsDevelopment() && !_dbInitialized)
    {
      var result = await _client
        .CreateDatabaseIfNotExistsAsync(DBNAME);
      await result.Database
        .CreateContainerIfNotExistsAsync(
          LINKCONTAINERNAME,
          "/domain");

      await result.Database.CreateContainerIfNotExistsAsync(
          REDIRECTSCONTAINERNAME,
          "/key");

      _dbInitialized = true;
    }
  }

}
