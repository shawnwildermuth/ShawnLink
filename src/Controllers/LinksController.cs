using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
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
    private readonly IMapper _mapper;

    public LinksController(ILogger<LinksController> logger, LinkManager linkManager, IMapper mapper)
    {
      _logger = logger;
      _linkManager = linkManager;
      _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LinkModel>>> Get()
    {
      return Ok(_mapper.Map<IEnumerable<LinkModel>>(await _linkManager.GetAll()));
    }

    [HttpPost]
    public async Task<ActionResult<LinkModel>> Post([FromBody] LinkModel model)
    {
      try
      {
        var result = await _linkManager.InsertLink(model.Key, model.Url);
        if (result is null) return BadRequest("Duplicate Key");
        return Ok(_mapper.Map<LinkModel>(result));
      }
      catch (Exception ex)
      {
        _logger.LogError($"Failed to insert link: {ex}");
      }

      return BadRequest("Failed");
    }

    [HttpPut]
    public async Task<ActionResult<LinkModel>> Put([FromBody] LinkModel model)
    {
      try
      {
        var result = await _linkManager.UpdateLink(model.Key, model.Url);
        if (result is not null) return Ok(_mapper.Map<LinkModel>(result));
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
