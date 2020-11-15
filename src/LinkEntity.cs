using Microsoft.Azure.Cosmos.Table;

namespace ShawnLink
{
  public class LinkEntity : TableEntity
  {
    public string Link { get; set; }
  }
}