$(document).on("click", ".view-history-action", function (e) {
    e.preventDefault();

    const grid = window.ticketGridInstance;
    if (!grid) return alert("Grid not found");

    const selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length === 0) {
        alert("Please select a row to view history.");
        return;
    }

    const ticket = selectedRows[0];

    // Set data from selected row
    $("#historyTicketId").text(ticket.TicketID);
    $("#historyComputer").text(ticket.Computer);
    $("#historyStatus").text(ticket.Status);
    $("#historyDescription").text(ticket.Description);
    $("#historyFiles").text(ticket.Files || "No File Uploaded");
    $("#historyOwner").text(ticket.Owner);
    $("#historyAssignedTo").text(ticket.AssignedTo);
    $("#historyNotifyUser").text(ticket.NotifyUser || "-");
    $("#historySource").text(ticket.Source || "Manual");
    $("#historyPriority").text(ticket.Priority);

    // Right Panel Action History
    $("#historyActionStatus").text(ticket.Status);
    $("#historyActionDescription").text(ticket.Description);
    $("#historyActionOwner").text(ticket.Owner);
    $("#historyActionAssignedTo").text(ticket.AssignedTo);
    $("#historyActionPriority").text(ticket.Priority);

    // Set Date dynamically
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB') + " " + now.toLocaleTimeString('en-US');
    $("#historyCreatedDate").text(formatted);

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("viewHistoryModal"));
    modal.show();
});
