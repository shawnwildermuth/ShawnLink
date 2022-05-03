using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ShawnLink.Models;

public class Link
{
  [JsonPropertyName("id")]
  public string Id { get; set; } = Guid.NewGuid().ToString();
  [JsonPropertyName("key")]
  public string Key { get; set; }
  [JsonPropertyName("url")]
  public string Url { get; set; }
  [JsonPropertyName("domain")]
  public string Domain { get; set; } = "shawnlink";
}
