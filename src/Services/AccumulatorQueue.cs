using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Channels;

namespace ShawnLink.Services;

public class AccumulatorQueue : IAccumulatorQueue
{
  private readonly Channel<Redirect> _queue;
  private readonly ILogger<AccumulatorQueue> _logger;

  public AccumulatorQueue(ILogger<AccumulatorQueue> logger)
  {
    var opts = new BoundedChannelOptions(100) { FullMode = BoundedChannelFullMode.Wait };
    _queue = Channel.CreateBounded<Redirect>(opts);
    _logger = logger;
  }

  public async ValueTask PushAsync([NotNull] Redirect redirect)
  {
    await _queue.Writer.WriteAsync(redirect);
    _logger.LogInformation("Added Redirect to Queue");
  }

  public async ValueTask<Redirect> PullAsync(CancellationToken cancellationToken)
  {
    var result = await _queue.Reader.ReadAsync(cancellationToken);
    _logger.LogInformation("Removed Redirect from Queue");
    return result;
  }
}
