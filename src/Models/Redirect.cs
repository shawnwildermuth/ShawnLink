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
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Key { get; set; }
  public DateTime Time { get; set; }
  public string Comments { get; set; }
  public string Referer { get; set; }
  public string Origin { get; set; }
  public string QueryString { get; set; }
  public string Destination { get; set; }
  public string Domain { get; set; }
}
