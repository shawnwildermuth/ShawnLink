using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace ShawnLink.Controllers
{
  public class FallbackController : Controller
  {
    public IActionResult Index()
    {
      return View();
    }
  }
}
