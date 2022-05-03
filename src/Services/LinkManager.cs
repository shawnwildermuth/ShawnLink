using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;

namespace ShawnLink.Services
{
  public class LinkManager
  {
    private const string PARTITIONKEY = "shawnlink";
    private const string LINKCACHE = "LINKCACHE";
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LinkManager> _logger;
    private readonly IMemoryCache _cache;
    private readonly IAccumulatorQueue _queue;
    private readonly ILinkRepository _repo;

    public LinkManager(ShawnConfiguration config,
      IWebHostEnvironment env,
      ILogger<LinkManager> logger,
      IMemoryCache cache,
      IAccumulatorQueue queue,
      ILinkRepository repo)
    {
      _env = env;
      _logger = logger;
      _cache = cache;
      _queue = queue;
      _repo = repo;
    }

    public async Task<IEnumerable<Link>> GetAll()
    {

      return await _repo.GetAllLinks();
    }

    public async Task<Link> InsertLink(string key, string url)
    {
      return await _repo.InsertLink(key, url);
    }

    public async Task<Link> UpdateLink(string key, string url)
    {
      return await _repo.UpdateLink(key, url);
    }

    public async Task<bool> DeleteLink(string key)
    {
      return await _repo.DeleteLink(key);
    }

    public void ClearCache()
    {
      _cache.Remove(LINKCACHE);
    }

    public async Task<bool> HandleRedirection(HttpContext ctx)
    {
      try
      {
        var (key, dest) = await FindRedirect(ctx.Request.Path);
        if (dest is not null)
        {
          ctx.Response.Redirect(dest);

          await _queue.PushAsync(new Redirect()
          {
            Key = key,
            Destination = dest,
            Referer = ctx.Request.Headers.Referer.FirstOrDefault(),
            Origin = ctx.Request.Headers.Origin.FirstOrDefault(),
            QueryString = ctx.Request.QueryString.Value,
            Time = DateTime.UtcNow
          });

          return true;
        }
      }
      catch (Exception ex)
      {
        _logger.LogError($"Exception during finding short link {ctx.Request.Path}", ex);
      }

      return false;

    }

    async Task<(string key, string dest)> FindRedirect(PathString path)
    {
      string redirectUrl = null;
      bool found = false;

      var key = path.Value.ToLower().Substring(1); // Remove leading slash
      if (!string.IsNullOrWhiteSpace(key))
      {

        Dictionary<string, string> linkCache;

        if (_cache.TryGetValue<Dictionary<string, string>>(LINKCACHE, out linkCache))
        {
          if (linkCache.ContainsKey(key))
          {
            _logger.LogInformation("Found key from cache");
            redirectUrl = linkCache[key];
            found = true;
          }
        }

        if (!found)
        {
          // Look it up
          var link = await _repo.GetLink(key);
          if (link != null)
          {
            if (linkCache is null) linkCache = new Dictionary<string, string>();
            linkCache[key] = link.Url;
            _cache.Set(LINKCACHE, linkCache, DateTimeOffset.Now.AddMinutes(60));

            _logger.LogInformation("Added Key to Cache");

            redirectUrl = link.Url;
          }
        }
      }

      return (key, redirectUrl);
    }
  }
}