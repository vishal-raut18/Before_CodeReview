using System.Web.Mvc;
using MyMvcApp.Models;
using MyMvcApp.DAL;

namespace MyMvcApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly UserManager _userManager;

        public AccountController()
        {
            _userManager = new UserManager();
        }

        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }


        [HttpPost]
        public ActionResult Login(LoginModel model)
        {
            if (ModelState.IsValid)
            {
                bool isValid = _userManager.IsValidUser(model.Username, model.Password);

                if (isValid)
                {
                    Session["Username"] = model.Username;
                    return RedirectToAction("Index", "Dashboard");
                }
                else
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
            }

            return View(model);
        }


    }
}
