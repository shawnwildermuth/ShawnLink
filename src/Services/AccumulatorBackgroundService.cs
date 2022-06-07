using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ShawnLink.Services;

public class AccumulatorBackgroundService : BackgroundService
{
  private readonly ILogger<AccumulatorBackgroundService> _logger;
  private readonly IAccumulatorQueue _queue;
  private readonly IServiceProvider _service;

  public AccumulatorBackgroundService(ILogger<AccumulatorBackgroundService> logger, 
    IAccumulatorQueue queue, 
    IServiceProvider service)
  {
    _logger = logger;
    _queue = queue;
    _service=service;
  }

  protected async override Task ExecuteAsync(CancellationToken stoppingToken)
  {
    while (!stoppingToken.IsCancellationRequested)
    {
      try
      {
        var redirect = await _queue.PullAsync(stoppingToken);

        _logger.LogInformation($"Processing Redirection for {redirect.Key}");

        using var scope = _service.CreateScope();
        var repo = scope.ServiceProvider.GetService<ILinkRepository>();
        await repo.InsertRedirect(redirect);

      }
      catch (Exception ex)
      {
        _logger.LogError($"Failure while processing queue {ex}");
      }
      }
  }

  public override async Task StopAsync(CancellationToken cancellationToken)
  {
    _logger.LogInformation("Stopping Background Service");
    await base.StopAsync(cancellationToken);
  }
}
