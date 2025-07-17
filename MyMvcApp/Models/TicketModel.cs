using System;
using System.ComponentModel.DataAnnotations;

namespace MyMvcApp.Models
{
    public class TicketModel
    {
        public int Id { get; set; }
        public string Computer { get; set; }
        public string Group { get; set; }
        public string Tags { get; set; }
        public string TicketID { get; set; }
        public string Status { get; set; }
        public string Owner { get; set; }
        public string AssignedTo { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastModified { get; set; }
        public string Source { get; set; }
        public string Priority { get; set; }

    }

}

