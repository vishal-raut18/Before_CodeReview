namespace MyMvcApp.Models
{
    public class TicketModel
    {
        public int ID { get; set; }
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
        public string CreatedAt { get; set; }
        public string LastModified { get; set; }
        public string LastModifiedBy { get; set; }
        public string Source { get; set; }
        public string Priority { get; set; }

        public string ComputerStatus { get; set; }
        public string Policy { get; set; }
    }
}
