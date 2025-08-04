$(document).ready(function () {
    // View Ticket from Dropdown
    $(document).on("click", ".view-ticket-action", function (e) {
        e.preventDefault();

        const gridInstance = $("#ticketGrid").dxDataGrid("instance");

        if (!gridInstance) {
            alert("Grid not found.");
            return;
        }

        const selectedRows = gridInstance.getSelectedRowsData();
        if (!selectedRows || selectedRows.length === 0) {
            alert("Please select a ticket to view.");
            return;
        }

        const data = selectedRows[0];

        // Fill modal fields from selected row
        $("#viewTicketId").text(data.TicketID || "-");
        $("#viewComputer").text(data.Computer || "-");
        $("#viewStatus").text(data.Status || "-");
        $("#viewDescription").text(data.Description || "-");
        $("#viewFiles").text(data.FilesUploaded || "");
        $("#viewYourEmail").text(data.Email || "-");
        $("#viewEmail").text(data.NotifyUser || "vishalralohatechnology@gmail.com");
        $("#viewAssignedTo").text(data.AssignedTo || "-");
        $("#viewSource").text(data.Source || "Manual");
        $("#viewPriority").text(data.Priority || "-");

        // Open View Ticket Modal
        const viewModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewTicketModal"));
        viewModal.show();
    });

    // Handle Edit button inside View Ticket modal
    $(document).on("click", "#viewEditBtn", function () {
        $("#viewTicketModal").modal("hide");
        $(".edit-ticket-action").trigger("click");
    });

    // Handle Close Ticket button inside View Ticket modal
    $(document).on("click", "#viewCloseTicketBtn", function () {
        $("#viewTicketModal").modal("hide");
        $(".change-status-closed").trigger("click");
    });
});
