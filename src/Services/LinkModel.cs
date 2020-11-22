using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShawnLink.Services
{
  public class LinkModel
  {
    [Required]
    public string Key { get; set; }
    [Required]
    [Url]
    public string Url { get; set; }

  }
}
