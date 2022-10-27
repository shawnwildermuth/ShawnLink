using System.Collections.Generic;

namespace ShawnLink.Services;

public interface ILinkRepository
{
  Task<IEnumerable<Link>> GetAllLinks();
  Task<IEnumerable<Link>> GetLinks(string shortCode);
  Task<IEnumerable<RedirectSummary>> GetRedirectSummaries();

  Task<Redirect> InsertRedirect(Redirect redirect);
  Task<Link> InsertLink(string key, string url, string domain);
  Task<Link> UpdateLink(string key, string url, string domain);
  Task<bool> DeleteLink(string key, string domain);
}
