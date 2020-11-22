using Microsoft.Azure.Cosmos.Table;

namespace ShawnLink.Services
{
  public class LinkEntity : TableEntity
  {
    public string Link { get; set; }
  }
}