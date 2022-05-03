using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ShawnLink.Services;

namespace ShawnLink.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class LinksController : ControllerBase
  {
    private readonly ILogger<LinksController> _logger;
    private readonly LinkManager _linkManager;
    private readonly ILinkRepository _repo;

    public LinksController(ILogger<LinksController> logger, 
      LinkManager linkManager,
      ILinkRepository repo)
    {
      _logger = logger;
      _linkManager = linkManager;
      _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Link>>> Get()
    {
      return Ok(await _linkManager.GetAll());
    }

    [HttpGet("summary")]
    public async Task<ActionResult<IEnumerable<RedirectSummary>>> Summary()
    {
      return Ok(await _repo.GetRedirectSummaries());
    }

    [HttpPost]
    public async Task<ActionResult<Link>> Post([FromBody] Link model)
    {
      try
      {
        var result = await _linkManager.InsertLink(model.Key, model.Url);
        if (result is null) return BadRequest("Duplicate Key");
        return Ok(result);
      }
      catch (Exception ex)
      {
        _logger.LogError($"Failed to insert link: {ex}");
      }

      return BadRequest("Failed");
    }

    [HttpPut]
    public async Task<ActionResult<Link>> Put([FromBody] Link model)
    {
      try
      {
        var result = await _linkManager.UpdateLink(model.Key, model.Url);
        if (result is not null) return Ok(result);
      }
      catch (Exception ex)
      {
        _logger.LogError($"Failed to insert link: {ex}");
      }

      return BadRequest("Failed to update");
    }

    [HttpDelete("{key}")]
    public async Task<ActionResult> Delete(string key)
    {
      try
      {
        if (await _linkManager.DeleteLink(key))
        {
          return Ok();
        }
      }
      catch (Exception ex)
      {
        _logger.LogError($"Failed to delete a Link {ex}");
      }
      return BadRequest("Failed to delete a Link");
    }
  }
}
