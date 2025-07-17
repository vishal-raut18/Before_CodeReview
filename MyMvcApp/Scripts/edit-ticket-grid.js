$(document).ready(function () {
    $(document).on("click", ".edit-ticket-action", function (e) {
        e.preventDefault();

        const gridInstance = window.ticketGridInstance;

        if (!gridInstance) {
            alert("Grid not found");
            return;
        }

        const selectedRows = gridInstance.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select a row to edit.");
            return;
        }

        const data = selectedRows[0];

        // Fill modal inputs
        $("#editComputer").val(data.Computer);
        $("#editStatus").val(data.Status);
        $("#editOwner").val(data.Owner);
        $("#editAssignedTo").val(data.AssignedTo);
        $("#editDescription").val(data.Description);
        $("#editEmail").val(data.Email);
        $("#editPriority").val(data.Priority);

        // Save ID
        $("#editTicketModal").data("ticketId", data.ID);

        // Show modal
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal"));
        modal.show();
    });

    $(document).on("click", "#updateTicketBtn", function () {
        const grid = window.ticketGridInstance;
        const ticketId = $("#editTicketModal").data("ticketId");
        if (!ticketId || !grid) return;

        const dataSource = grid.option("dataSource"); // Get current source (bound array)
        const index = dataSource.findIndex(t => t.ID === ticketId);
        if (index === -1) return;

        // Update values
        dataSource[index] = {
            ...dataSource[index], // preserve other fields
            Computer: $("#editComputer").val(),
            Status: $("#editStatus").val(),
            Owner: $("#editOwner").val(),
            AssignedTo: $("#editAssignedTo").val(),
            Description: $("#editDescription").val(),
            Email: $("#editEmail").val(),
            Priority: $("#editPriority").val()
        };

        // Set new data source to refresh grid properly
        grid.option("dataSource", dataSource);

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById("editTicketModal")).hide();
    });
});
