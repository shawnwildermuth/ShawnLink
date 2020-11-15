using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ShawnLink
{
  public class LinkManager
  {
    private const string PARTITIONKEY = "shawnlink";
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LinkManager> _logger;
    private string _connectionString;
    private CloudStorageAccount _account;
    private CloudTableClient _tableClient;
    private CloudTable _table;

    public LinkManager(IConfiguration config, 
      IWebHostEnvironment env,
      ILogger<LinkManager> logger)
    {
      _connectionString = config["Storage:ConnectionString"];
      _account = CloudStorageAccount.Parse(_connectionString);
      _tableClient = _account.CreateCloudTableClient();
      _table = _tableClient.GetTableReference("links");
      _env = env;
      _logger = logger;
    }

    public async Task HandleRedirection(HttpContext ctx)
    {
      try
      {
        var redirect = await FindRedirect(ctx.Request.Path);
        if (redirect is not null)
        {
          ctx.Response.Redirect(redirect);
          return;
        }
      }
      catch (Exception ex)
      {
        _logger.LogError("Exception during finding short link", ex);
      }

      // Default to index.html
      await ctx.Response.WriteAsync(await File.ReadAllTextAsync(Path.Combine(_env.ContentRootPath, "index.html")));
      ctx.Response.ContentType = "text/html";
    }

    async Task<string> FindRedirect(PathString path)
    {
      var key = path.Value.ToLower().Substring(1); // Remove leading slash
      if (!string.IsNullOrWhiteSpace(key))
      {
        var op = TableOperation.Retrieve<LinkEntity>(PARTITIONKEY, key);
        var result = await _table.ExecuteAsync(op);
        var link = result.Result as LinkEntity;
        if (link != null) return link.Link;
      }
      return null;
    }
  }
}