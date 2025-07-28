using System.Web.Mvc;
using MyMvcApp.Models;
using System.Configuration;
using System.Data.SqlClient;

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
            if (ModelState.IsValid)
            {
                string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    string query = "SELECT COUNT(*) FROM Users WHERE Username = @Username AND Password = @Password";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Username", model.Username);
                        cmd.Parameters.AddWithValue("@Password", model.Password); // Plain text - only for demo

                        conn.Open();
                        int userCount = (int)cmd.ExecuteScalar();

                        if (userCount > 0)
                        {
                            Session["Username"] = model.Username;
                            return RedirectToAction("Index", "Dashboard");
                        }
                        else
                        {
                            ModelState.AddModelError("", "Invalid username or password.");
                        }
                    }
                }
            }

            return View(model);
        }
    }
}
