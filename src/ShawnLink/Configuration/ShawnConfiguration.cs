using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace ShawnLink.Configuration
{

  public class ShawnConfiguration
  {
    public ShawnConfiguration(IConfiguration config)
    {
      config.Bind(this);
    }

    public SecurityConfiguration Security { get; set; }
    public StorageConfiguration Storage { get; set; }

    public class StorageConfiguration
    {
      public string ConnectionString { get; set; }
    }

    public class SecurityConfiguration
    {
      public string Username { get; set; }
      public string Password { get; set; }
    }
  }
}
