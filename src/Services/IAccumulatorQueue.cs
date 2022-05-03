using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace ShawnLink.Services;

public interface IAccumulatorQueue
{
  ValueTask<Redirect> PullAsync(CancellationToken cancellationToken);
  ValueTask PushAsync([NotNull] Redirect redirect);
}
