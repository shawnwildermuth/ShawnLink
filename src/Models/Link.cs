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
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Key { get; set; }
  public string Url { get; set; }
  public string Domain { get; set; } = "shawnlink";
}
