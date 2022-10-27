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
    private readonly IHttpContextAccessor _contextAccessor;

    public LinkManager(ShawnConfiguration config,
      IWebHostEnvironment env,
      ILogger<LinkManager> logger,
      IMemoryCache cache,
      IAccumulatorQueue queue,
      ILinkRepository repo,
      IHttpContextAccessor contextAccessor)
    {
      _env = env;
      _logger = logger;
      _cache = cache;
      _queue = queue;
      _repo = repo;
      _contextAccessor = contextAccessor;
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
        var (key, dest, domain) = await FindRedirect(ctx.Request.Path);
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
            Time = DateTime.UtcNow,
            Domain = domain
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

    async Task<(string key, string dest, string domain)> FindRedirect(PathString path)
    {
      string redirectUrl = null;
      bool found = false;
      string domain = _contextAccessor.HttpContext.Request.PathBase.Value!.ToLower();


      var key = path.Value.ToLower().Substring(1); // Remove leading slash
      if (!string.IsNullOrWhiteSpace(key))
      {

        Dictionary<(string, string), string> linkCache;

        if (_cache.TryGetValue<Dictionary<(string, string), string>>(LINKCACHE, out linkCache))
        {
          if (linkCache.ContainsKey((key, domain)))
          {
            _logger.LogInformation("Found key from cache");
            redirectUrl = linkCache[(key, domain)];
            found = true;
          }
        }

        if (!found)
        {
          // Look it up
          var links = await _repo.GetLink(key, domain);
          if (links.Any())
          {
            if (linkCache is null) linkCache = new Dictionary<(string, string), string>();
            Link result = null;
            if (links.Count() > 1)
            {
              foreach (var link in links)
              {
                if (domain.ToLower().Contains(link.Domain.ToLower()))
                {
                  result = link;
                  break;
                }
              }
            }
            else
            {
              result = links.First();
            }

            if (result is not null)
            {
              linkCache[(key, domain)] = result.Url;
              _cache.Set(LINKCACHE, linkCache, DateTimeOffset.Now.AddMinutes(60));

              _logger.LogInformation("Added Key to Cache");

              redirectUrl = result.Url;
            }
          }
        }
      }

      return (key, redirectUrl, domain);
    }
  }
}