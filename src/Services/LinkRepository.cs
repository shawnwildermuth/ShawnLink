using System.Collections.Generic;
using Azure.Cosmos;
using Azure.Cosmos.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ShawnLink.Data;

namespace ShawnLink.Services;

public class LinkRepository : ILinkRepository
{
  private readonly ShawnConfiguration _config;
  private readonly ILogger<LinkRepository> _logger;
  private readonly LinkContext _ctx;

  public LinkRepository(ShawnConfiguration config,
    ILogger<LinkRepository> logger,
    LinkContext ctx)
  {
    _config = config;
    _logger = logger;
    _ctx = ctx;
  }

  public async Task<IEnumerable<Link>> GetAllLinks()
  {
    var results = await _ctx.Links.OrderBy(l => l.Key).ToListAsync();

    return results;
  }

  public async Task<IEnumerable<RedirectSummary>> GetRedirectSummaries()
  {
    var results = await _ctx.Redirects.GroupBy(k => k.Key)
      .Select(s => new RedirectSummary() { ClickCount = s.Count(), Key = s.Key })
      .ToListAsync();

    return results;

  }

  public async Task<Link> GetLink(string key)
  {

    var result = await _ctx.Links.Where(l => l.Key.ToLower() == key.ToLower()).FirstOrDefaultAsync();

    if (result is null) return null;

    return result;
  }


  public async Task<Link> InsertLink(string key, string url)
  {
    var exists = await _ctx.Links.Where(l => l.Key.ToLower() == key.ToLower()).AnyAsync();
    if (!exists)
    {
      var link = new Link() { Key = key, Url = url };
      _ctx.Add(link);
      if ((await _ctx.SaveChangesAsync()) > 0)
      {
        return link;
      };
    }

    return null;
  }


  public async Task<Link> UpdateLink(string key, string url)
  {
    var link = await _ctx.Links.Where(l => l.Key.ToLower() == key.ToLower()).FirstOrDefaultAsync();
    if (link is not null)
    {
      link.Url = url;
      if ((await _ctx.SaveChangesAsync()) > 0)
      {
        return link;
      };
    }

    return null;
  }

  public async Task<bool> DeleteLink(string key)
  {
    var link = await _ctx.Links.Where(l => l.Key.ToLower() == key.ToLower()).FirstOrDefaultAsync();
    if (link is not null)
    {
      _ctx.Remove(link);
      if ((await _ctx.SaveChangesAsync()) > 0)
      {
        return true;
      };
    }

    return false;
  }

  public async Task<Redirect> InsertRedirect(Redirect redirect)
  {
    _ctx.Redirects.Add(redirect);
    if ((await _ctx.SaveChangesAsync()) > 0)
    {
      return redirect;
    };

    return null;
  }


}
