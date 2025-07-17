

$(document).ready(function () {
    alert("edit-ticket.js loaded!");
    // When "Edit Ticket" dropdown item is clicked
    $(document).on("click", ".edit-ticket-action", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        const selectedRows = grid.getSelectedRowsData();
        console.log("fnsdf");

        // Validation: must select exactly one row
        if (selectedRows.length === 0) {
            alert("Please select a row to edit yarrr.");
            return;
        }
        if (selectedRows.length > 1) {
            alert("Please select only one row to edit.");
            return;
        }

        const rowData = selectedRows[0];

        // Fill modal fields with selected row data
        $("#editComputer").val(rowData.Computer);
        $("#editStatus").val(rowData.Status);
        $("#editOwner").val(rowData.Owner);
        $("#editAssignedTo").val(rowData.AssignedTo);
        $("#editDescription").val(rowData.Description);
        $("#editEmail").val(rowData.Email);
        $("#editPriority").val(rowData.Priority);

        // Store row ID for later update
        $("#editTicketModal").data("rowId", rowData.ID);

        // Show the modal
        $("#editTicketModal").modal("show");
    });

    // When Save button is clicked in modal
    $("#updateTicketBtn").on("click", function () {
        const grid = $("#ticketGrid").dxDataGrid("instance");
        const rowId = $("#editTicketModal").data("rowId");

        if (!rowId) {
            alert("No row selected to update.");
            return;
        }

        // Collect updated values
        const updatedData = {
            Computer: $("#editComputer").val(),
            Status: $("#editStatus").val(),
            Owner: $("#editOwner").val(),
            AssignedTo: $("#editAssignedTo").val(),
            Description: $("#editDescription").val(),
            Email: $("#editEmail").val(),
            Priority: $("#editPriority").val()
        };

        // Apply changes to each column
        for (const field in updatedData) {
            grid.cellValue(rowId, field, updatedData[field]);
        }

        // Hide the modal
        $("#editTicketModal").modal("hide");

        // Optionally: show a toast or alert
        // alert("Ticket updated successfully.");
    });
});
