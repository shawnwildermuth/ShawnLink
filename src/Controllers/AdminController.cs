using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ShawnLink.Controllers
{
  public class AdminController : Controller
  {
    public AdminController()
    {

    }

    public IActionResult Index()
    {
      return View();
    }
  }
}
