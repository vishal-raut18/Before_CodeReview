using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using MyMvcApp.Models;

namespace MyMvcApp.DAL
{
    public class TicketManager
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public List<TicketModel> GetTickets()
        {
            var tickets = new List<TicketModel>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = "SELECT * FROM Tickets ORDER BY CreatedAt DESC";
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
                            LastModifiedBy = reader["LastModifiedBy"].ToString(),
                            Source = reader["Source"].ToString(),
                            Priority = reader["Priority"].ToString(),
                            ComputerStatus=reader["ComputerStatus"].ToString(),
                            Policy = reader["Policy"].ToString()
                        });
                    }
                }
            }
            return tickets;
        }

        public int SaveTicket(TicketModel ticket)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"INSERT INTO Tickets 
                    (Computer, [Group], Tags, TicketID, Status, Owner, AssignedTo, Username, Email, Description, Notes, CreatedAt, LastModified, Source, Priority, LastModifiedBy,ComputerStatus)
                    VALUES 
                    (@Computer, @Group, @Tags, @TicketID, @Status, @Owner, @AssignedTo, @Username, @Email, @Description, @Notes, @CreatedAt, @LastModified, @Source, @Priority, @LastModifiedBy,@ComputerStatus);
                    SELECT CAST(SCOPE_IDENTITY() AS INT);";

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
                    cmd.Parameters.AddWithValue("@Priority", ticket.Priority ?? "");
                    cmd.Parameters.AddWithValue("@LastModifiedBy", ticket.LastModifiedBy ?? "vishalr@alohatechnology.com");
                    cmd.Parameters.AddWithValue("@ComputerStatus", ticket.ComputerStatus ?? "Offline");
                    cmd.Parameters.AddWithValue("@Policy", ticket.Policy ?? "Semi-Automatic");

                    return Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
        }

        public void UpdateStatus(List<int> ids, string newStatus)
        {
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
        }

        public bool DeleteTickets(string[] ticketIds)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                int totalDeleted = 0;
                foreach (var ticketID in ticketIds)
                {
                    string query = "DELETE FROM Tickets WHERE TicketID = @TicketID";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.Clear();
                        cmd.Parameters.AddWithValue("@TicketID", ticketID);
                        totalDeleted += cmd.ExecuteNonQuery();
                    }
                }
                return totalDeleted > 0;
            }
        }

        public void UpdateTicket(TicketModel model)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = @"UPDATE Tickets
                             SET Computer = @Computer,
                                 Status = @Status,
                                 Owner = @Owner,
                                 AssignedTo = @AssignedTo,
                                 Description = @Description,
                                 Email = @Email,
                                 Priority = @Priority
                             WHERE ID = @ID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Computer", model.Computer ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Status", model.Status ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Owner", model.Owner ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@AssignedTo", model.AssignedTo ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Description", model.Description ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Priority", model.Priority ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@ID", model.ID);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<object> GetHistory(string ticketId)
        {
            List<object> list = new List<object>();

            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                var cmd = new SqlCommand(@"
            SELECT th.ActionType, th.ActionBy, th.ActionDate,
                   th.ChangedFields, th.PreviousValues, th.NewValues
            FROM TicketHistory th
            WHERE th.TicketID = (
                SELECT ID FROM Tickets WHERE TicketID = @TicketID
            )
            ORDER BY th.ActionDate", conn);

                cmd.Parameters.AddWithValue("@TicketID", ticketId);

                var reader = cmd.ExecuteReader();
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
            }

            return list;
        }

    }
}
