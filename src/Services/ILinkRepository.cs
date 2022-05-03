using System.Collections.Generic;

namespace ShawnLink.Services;

public interface ILinkRepository
{
  Task<bool> DeleteLink(string key);
  Task<IEnumerable<Link>> GetAllLinks();
  Task<Link> GetLink(string shortCode);
  Task<Redirect> InsertRedirect(Redirect redirect);
  Task<Link> InsertLink(string key, string url);
  Task<Link> UpdateLink(string key, string url);
  Task<IEnumerable<RedirectSummary>> GetRedirectSummaries();
}
