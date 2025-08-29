using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using MyMvcApp.Models;
using Newtonsoft.Json.Linq;
using MyMvcApp.DAL;

namespace MyMvcApp.Controllers
{
    public class TicketController : Controller
    {
        private readonly TicketManager _dal = new TicketManager();
        public ActionResult Ticketing()
        {
            return View();
        }


        [HttpGet]
        public JsonResult GetTickets()
        {
            var tickets = _dal.GetTickets();           
            return Json(tickets, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveTicket(TicketModel ticket)
        {
            try
            {
                int id = _dal.SaveTicket(ticket);
                return Json(new { success = true, message = "Ticket saved successfully", id = id });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error saving ticket: " + ex.Message });
            }
        }

       

        [HttpPost]
        public ActionResult UpdateTicketStatus(List<int> ids, string newStatus)
        {
            if (ids == null || ids.Count == 0 || string.IsNullOrEmpty(newStatus))
                return new HttpStatusCodeResult(400, "Invalid input");

            _dal.UpdateStatus(ids, newStatus);
            return Json(new { success = true });
        }

        [HttpPost]
        public JsonResult Delete(string[] id)
        {
            try
            {
               
                bool result = _dal.DeleteTickets(id);
                if (result)
                    return Json(new { success = true });
                else
                    return Json(new { success = false, message = "No tickets found to delete." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult UpdateTicket(TicketModel model)
        {
            try
            {
                _dal.UpdateTicket(model);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, ex.Message);
            }
        }

        [HttpGet]
        public JsonResult GetHistory(string ticketId)
        {
            var history = _dal.GetHistory(ticketId);
            return Json(history, JsonRequestBehavior.AllowGet);
        }

    }
}
