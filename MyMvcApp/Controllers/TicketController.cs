using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web.Mvc;
using MyMvcApp.Models;
using Newtonsoft.Json.Linq;

namespace MyMvcApp.Controllers
{
    public class TicketController : Controller
    {

        public ActionResult Index()
        {
            return View(); 
        }


        private readonly string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;



        // GET: /Ticket/
        [HttpGet]
        public JsonResult GetTickets()
        {
            List<TicketModel> tickets = new List<TicketModel>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Tickets";
                SqlCommand cmd = new SqlCommand(query, conn);
                conn.Open();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tickets.Add(new TicketModel
                        {
                            ID = Convert.ToInt32(reader["ID"]),
                            Computer = reader["Computer"].ToString(),
                            Group = reader["Group"].ToString(),
                            Tags = reader["Tags"].ToString(),
                            TicketID = reader["TicketID"].ToString(),
                            Status = reader["Status"].ToString(),
                            Owner = reader["Owner"].ToString(),
                            AssignedTo = reader["AssignedTo"].ToString(),
                            Username = reader["Username"].ToString(),
                            Email = reader["Email"].ToString(),
                            Description = reader["Description"].ToString(),
                            Notes = reader["Notes"].ToString(),
                            CreatedAt = Convert.ToDateTime(reader["CreatedAt"]).ToString("yyyy-MM-dd HH:mm:ss"),
                            LastModified = Convert.ToDateTime(reader["LastModified"]).ToString("yyyy-MM-dd HH:mm:ss"),
                            Source = reader["Source"].ToString(),
                            Priority = reader["Priority"].ToString()
                        });
                    }
                }
            }

            return Json(tickets, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult SaveTicket(TicketModel ticket)
        {
            try
            {

                using (SqlConnection conn = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
                {
                    conn.Open();
                    string query = @"INSERT INTO Tickets 
            (Computer, [Group], Tags, TicketID, Status, Owner, AssignedTo, Username, Email, Description, Notes, CreatedAt, LastModified, Source, Priority)
            VALUES 
            (@Computer, @Group, @Tags, @TicketID, @Status, @Owner, @AssignedTo, @Username, @Email, @Description, @Notes, @CreatedAt, @LastModified, @Source, @Priority);
            SELECT SCOPE_IDENTITY();  SELECT CAST(SCOPE_IDENTITY() AS INT);  -- ✅ This returns the newly inserted ID
";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Computer", ticket.Computer ?? "");
                        cmd.Parameters.AddWithValue("@Group", ticket.Group ?? "IT");
                        cmd.Parameters.AddWithValue("@Tags", ticket.Tags ?? "");
                        cmd.Parameters.AddWithValue("@TicketID", ticket.TicketID ?? "");
                        cmd.Parameters.AddWithValue("@Status", ticket.Status ?? "");
                        cmd.Parameters.AddWithValue("@Owner", ticket.Owner ?? "");
                        cmd.Parameters.AddWithValue("@AssignedTo", ticket.AssignedTo ?? "");
                        cmd.Parameters.AddWithValue("@Username", ticket.Username ?? "New ");
                        cmd.Parameters.AddWithValue("@Email", ticket.Email ?? "");
                        cmd.Parameters.AddWithValue("@Description", ticket.Description ?? "");
                        cmd.Parameters.AddWithValue("@Notes", ticket.Notes ?? "");
                        cmd.Parameters.AddWithValue("@CreatedAt", DateTime.Now);
                        cmd.Parameters.AddWithValue("@LastModified", DateTime.Now);
                        cmd.Parameters.AddWithValue("@Source", ticket.Source ?? "Manual");
                        cmd.Parameters.AddWithValue("@Priority", ticket.Priority ?? "Low");

                        int insertedId = Convert.ToInt32(cmd.ExecuteScalar()); // Get auto-generated ID
                        return Json(new { success = true, message = "Ticket saved successfully", id = insertedId });
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Error saving ticket: " + ex.Message });
            }
        }






        // GET: /Ticket/Edit/{id}
        public ActionResult Edit(int id)
        {
            TicketModel ticket = null;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Tickets WHERE ID = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);

                conn.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    ticket = new TicketModel
                    {
                        ID = id,
                        Computer = reader["Computer"].ToString(),
                        Group = reader["Group"].ToString(),
                        Tags = reader["Tags"].ToString(),
                        TicketID = reader["TicketID"].ToString(),
                        Status = reader["Status"].ToString(),
                        Owner = reader["Owner"].ToString(),
                        AssignedTo = reader["AssignedTo"].ToString(),
                        Username = reader["Username"].ToString(),
                        Email = reader["Email"].ToString(),
                        Description = reader["Description"].ToString(),
                        Notes = reader["Notes"].ToString(),
                        CreatedAt = Convert.ToDateTime(reader["CreatedAt"]).ToString(),
                        LastModified = Convert.ToDateTime(reader["LastModified"]).ToString(),
                        Source = reader["Source"].ToString(),
                        Priority = reader["Priority"].ToString()
                    };
                }
            }

            if (ticket == null)
                return HttpNotFound();

            return View(ticket);
        }

        // POST: /Ticket/Edit
        [HttpPost]
        public ActionResult Edit(TicketModel model)
        {
            if (ModelState.IsValid)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    string query = @"
                        UPDATE Tickets SET
                            Computer = @Computer,
                            [Group] = @Group,
                            Tags = @Tags,
                            Owner = @Owner,
                            AssignedTo = @AssignedTo,
                            Username = @Username,
                            Email = @Email,
                            Priority = @Priority,
                            Source = @Source,
                            Description = @Description,
                            LastModified = @LastModified
                        WHERE ID = @Id";

                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.AddWithValue("@Computer", model.Computer);
                    cmd.Parameters.AddWithValue("@Group", model.Group);
                    cmd.Parameters.AddWithValue("@Tags", model.Tags ?? "");
                    cmd.Parameters.AddWithValue("@Owner", model.Owner);
                    cmd.Parameters.AddWithValue("@AssignedTo", model.AssignedTo);
                    cmd.Parameters.AddWithValue("@Username", model.Username);
                    cmd.Parameters.AddWithValue("@Email", model.Email);
                    cmd.Parameters.AddWithValue("@Priority", model.Priority);
                    cmd.Parameters.AddWithValue("@Source", model.Source);
                    cmd.Parameters.AddWithValue("@Description", model.Description);
                    cmd.Parameters.AddWithValue("@LastModified", DateTime.Now);
                    cmd.Parameters.AddWithValue("@Id", model.ID);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                TempData["Message"] = "Ticket updated successfully!";
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // GET: /Ticket/Close/{id}
        public ActionResult Close(int id)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "UPDATE Tickets SET Status = 'Closed', LastModified = @LastModified WHERE ID = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@LastModified", DateTime.Now);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            TempData["Message"] = $"Ticket #{id} closed.";
            return RedirectToAction("Index");
        }

        // GET: /Ticket/Delete/{id}
        public ActionResult Delete(int id)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "DELETE FROM Tickets WHERE ID = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                cmd.ExecuteNonQuery();
            }

            TempData["Message"] = $"Ticket #{id} deleted.";
            return RedirectToAction("Index");
        }

        [HttpPost]
        public ActionResult UpdateTicketStatus(List<int> ids, string newStatus)
        {
            if (ids == null || ids.Count == 0 || string.IsNullOrEmpty(newStatus))
                return new HttpStatusCodeResult(400, "Invalid input");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                foreach (int id in ids)
                {
                    string query = "UPDATE Tickets SET Status = @Status, LastModified = @LastModified WHERE ID = @Id";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@Status", newStatus);
                        cmd.Parameters.AddWithValue("@LastModified", DateTime.Now);
                        cmd.Parameters.AddWithValue("@Id", id);
                        cmd.ExecuteNonQuery();
                    }
                }
            }

            return Json(new { success = true });
        }


        [HttpPost]
        public JsonResult Delete(string id)
        {
            try
            {
                string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();

                    string query = "DELETE FROM Tickets WHERE TicketID = @TicketID";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@TicketID", id);
                        int rowsAffected = cmd.ExecuteNonQuery();

                        if (rowsAffected > 0)
                        {
                            return Json(new { success = true });
                        }
                        else
                        {
                            return Json(new { success = false, message = "Ticket not found." });
                        }
                    }
                }
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
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString))
                {
                    con.Open();
                    string query = @"UPDATE Tickets
                             SET Computer = @Computer,
                                 Status = @Status,
                                 Owner = @Owner,
                                 AssignedTo = @AssignedTo,
                                 Description = @Description,
                                 Email = @Email,
                                 Priority = @Priority
                             WHERE ID = @ID"; // Keep ID fixed

                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Computer", model.Computer ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Status", model.Status ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Owner", model.Owner ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@AssignedTo", model.AssignedTo ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Description", model.Description ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@Priority", model.Priority ?? (object)DBNull.Value);
                        cmd.Parameters.AddWithValue("@ID", model.ID); // Primary key

                        cmd.ExecuteNonQuery();
                    }
                }

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                // Log ex
                return new HttpStatusCodeResult(500, ex.Message);
            }
        }


        [HttpPost]
        public JsonResult CreateTicket(TicketModel ticket)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
            INSERT INTO Tickets 
            (Computer, [Group], Tags, TicketID, Status, Owner, AssignedTo, Username, Email, Description, Notes, CreatedAt, LastModified, Source, Priority)
            VALUES 
            (@Computer, @Group, @Tags, @TicketID, @Status, @Owner, @AssignedTo, @Username, @Email, @Description, @Notes, @CreatedAt, @LastModified, @Source, @Priority);
            SELECT CAST(SCOPE_IDENTITY() AS INT);";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Computer", ticket.Computer);
                    cmd.Parameters.AddWithValue("@Group", ticket.Group);
                    cmd.Parameters.AddWithValue("@Tags", ticket.Tags ?? string.Empty);
                    cmd.Parameters.AddWithValue("@TicketID", ticket.TicketID);
                    cmd.Parameters.AddWithValue("@Status", ticket.Status);
                    cmd.Parameters.AddWithValue("@Owner", ticket.Owner);
                    cmd.Parameters.AddWithValue("@AssignedTo", ticket.AssignedTo);
                    cmd.Parameters.AddWithValue("@Username", ticket.Username);
                    cmd.Parameters.AddWithValue("@Email", ticket.Email);
                    cmd.Parameters.AddWithValue("@Description", ticket.Description);
                    cmd.Parameters.AddWithValue("@Notes", ticket.Notes ?? string.Empty);
                    cmd.Parameters.AddWithValue("@CreatedAt", ticket.CreatedAt);
                    cmd.Parameters.AddWithValue("@LastModified", ticket.LastModified);
                    cmd.Parameters.AddWithValue("@Source", ticket.Source ?? "Manual");
                    cmd.Parameters.AddWithValue("@Priority", ticket.Priority ?? "P3");

                    conn.Open();
                    int insertedId = (int)cmd.ExecuteScalar();
                    return Json(new { success = true, id = insertedId });
                }
            }
        }

        [HttpGet]
        public JsonResult GetHistory(string ticketId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                // 1. Get the internal numeric ID from Tickets
                var getIdCmd = new SqlCommand("SELECT ID FROM Tickets WHERE TicketID = @TicketID", conn);
                getIdCmd.Parameters.AddWithValue("@TicketID", ticketId);

                object ticketIdObj = getIdCmd.ExecuteScalar();

                if (ticketIdObj == null)
                {
                    // No ticket with this TicketID
                    return Json(new List<object>(), JsonRequestBehavior.AllowGet);
                }

                int numericTicketId = Convert.ToInt32(ticketIdObj);

                // 2. Get history by that numeric ID
                var cmd = new SqlCommand(@"
            SELECT ActionType, ActionBy, ActionDate,
                   ChangedFields, PreviousValues, NewValues
            FROM TicketHistory
            WHERE TicketID = @TicketID
            ORDER BY ActionDate", conn);

                cmd.Parameters.AddWithValue("@TicketID", numericTicketId);

                var reader = cmd.ExecuteReader();
                var list = new List<object>();

                while (reader.Read())
                {
                    list.Add(new
                    {
                        actionType = reader.GetString(0),
                        actionBy = reader.GetString(1),
                        actionDate = reader.GetDateTime(2).ToString("yyyy-MM-dd HH:mm:ss"),
                        changedFields = reader.IsDBNull(3) ? null : reader.GetString(3),
                        previousValues = reader.IsDBNull(4) ? null : reader.GetString(4),
                        newValues = reader.IsDBNull(5) ? null : reader.GetString(5)
                    });
                }

                return Json(list, JsonRequestBehavior.AllowGet);
            }
        }



    }
}
