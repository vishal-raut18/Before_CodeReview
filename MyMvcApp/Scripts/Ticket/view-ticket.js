$(document).ready(function () {
    // Handle click on View Ticket action
    $(document).on("click", ".view-ticket-action", function (e) {
        e.preventDefault();

        const gridInstance = window.ticketGridInstance || window.grid;
        if (!gridInstance) {
            alert("Grid not found.");
            return;
        }

        const selectedRows = gridInstance.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select a ticket to view.");
            return;
        }

        const data = selectedRows[0];

        // Fill modal with ticket data
        $("#viewTicketId").text(data.TicketID || "-");
        $("#viewComputer").text(data.Computer || "-");
        $("#viewStatus").text(data.Status || "-");
        $("#viewDescription").text(data.Description || "-");
        $("#viewFiles").text(data.FilesUploaded || "-");
        $("#viewYourEmail").text(data.Email || "-");
        $("#viewEmail").text(data.NotifyUser || "-");
        $("#viewAssignedTo").text(data.AssignedTo || "-");
        $("#viewSource").text(data.Source || "Manual");
        $("#viewPriority").text(data.Priority || "-");

        // Show View Modal
        const viewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewTicketModal"));
        viewModal.show();
    });
    
    // Handle Edit button inside view modal
    $(document).on("click", "#viewEditBtn", function () {
        $("#viewTicketModal").modal("hide"); 
        $(".edit-ticket-action").trigger("click"); 
    });

    //Close ticket button action
    $(document).on("click", "#viewCloseTicketBtn", function () {
        $("#viewTicketModal").modal("hide");
        $(".delete-ticket-action").trigger("click");
       
    });
});
