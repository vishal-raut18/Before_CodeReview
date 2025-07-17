using System.Web.Mvc;
using MyMvcApp.Models;

namespace MyMvcApp.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(LoginModel model)
        {
            if (ModelState.IsValid && model.Username == "admin" && model.Password == "admin")
            {
                Session["Username"] = model.Username;
                return RedirectToAction("Index", "Dashboard");
            }

            ModelState.AddModelError("", "Invalid username or password.");
            return View(model);
        }
    }
}
