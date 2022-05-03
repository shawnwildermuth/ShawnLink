using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ShawnLink.Models;

public class RedirectSummary
{
  [JsonPropertyName("clickCount")]
  public int ClickCount { get; set; }
  [JsonPropertyName("key")]
  public string Key { get; set; }
}
