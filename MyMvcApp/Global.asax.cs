using System.Web.Mvc;
using System.Web.Routing;

namespace MyMvcApp
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            // Registers all areas (if you use them)
            AreaRegistration.RegisterAllAreas();

            // Registers route mappings defined in RouteConfig.cs
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
