using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using MyMvcApp.Models;

namespace MyMvcApp.Controllers
{
    public class TicketController : Controller

    {

        // Simulated in-memory ticket list (you can replace with DB later)
        private static List<TicketModel> TicketList = new List<TicketModel>();

        // GET: /Ticket/
        public ActionResult Index()

        {
            return View(TicketList);
        }

        // POST: /Ticket/Create
        [HttpPost]
        public ActionResult Create(TicketModel model)
        {
            if (ModelState.IsValid)
            {
                model.Id = TicketList.Count > 0 ? TicketList.Max(t => t.Id) + 1 : 1;
                model.Status = "Open";
                model.CreatedAt = DateTime.Now;
                TicketList.Add(model);

                TempData["Message"] = "Ticket created successfully!";
                return RedirectToAction("Index");
            }

            // If validation fails, reload the list and show errors
            return View("Index", TicketList);
        }

        // GET: /Ticket/Edit/{id}
        public ActionResult Edit(int id)
        {
            var ticket = TicketList.FirstOrDefault(t => t.Id == id);
            if (ticket == null)
            {
                return HttpNotFound();
            }

            return View(ticket);
        }

        // POST: /Ticket/Edit
        [HttpPost]
        public ActionResult Edit(TicketModel model)
        {
            if (ModelState.IsValid)
            {
                var existing = TicketList.FirstOrDefault(t => t.Id == model.Id);
                if (existing != null)
                {
                    existing.Group = model.Group;
                    existing.Tags = model.Tags;
                    existing.Owner = model.Owner;
                    existing.AssignedTo = model.AssignedTo;
                    existing.Username = model.Username;
                    existing.Email = model.Email;
                    existing.Priority = model.Priority;
                    existing.Source = model.Source;
                    existing.Description = model.Description;
                    existing.Computer = model.Computer;
                }

                TempData["Message"] = "Ticket updated successfully!";
                return RedirectToAction("Index");
            }

            return View(model);
        }


        // Optional: DELETE or CLOSE action (can add next)
        // GET: /Ticket/Close/{id}
        public ActionResult Close(int id)
        {
            var ticket = TicketList.FirstOrDefault(t => t.Id == id);
            if (ticket != null)
            {
                ticket.Status = "Closed";
                TempData["Message"] = $"Ticket #{id} closed.";
            }

            return RedirectToAction("Index");
        }

        // GET: /Ticket/Delete/{id}
        public ActionResult Delete(int id)
        {
            var ticket = TicketList.FirstOrDefault(t => t.Id == id);
            if (ticket != null)
            {
                TicketList.Remove(ticket);
                TempData["Message"] = $"Ticket #{id} deleted.";
            }

            return RedirectToAction("Index");
        }

    }
}
