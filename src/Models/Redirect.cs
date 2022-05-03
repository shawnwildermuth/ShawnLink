using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Primitives;

namespace ShawnLink.Models;

public class Redirect
{
  [JsonPropertyName("id")]
  public string Id { get; set; } = Guid.NewGuid().ToString();
  [JsonPropertyName("key")]
  public string Key { get; set; }
  [JsonPropertyName("time")]
  public DateTime Time { get; set; }
  [JsonPropertyName("comments")]
  public string Comments { get; set; }
  [JsonPropertyName("referer")]
  public string Referer { get; internal set; }
  [JsonPropertyName("origin")]
  public string Origin { get; internal set; }
  [JsonPropertyName("queryString")]
  public string QueryString { get; internal set; }
  [JsonPropertyName("destination")]
  public string Destination { get; internal set; }
}
