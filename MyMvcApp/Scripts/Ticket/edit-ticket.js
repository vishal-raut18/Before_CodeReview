function showSuccessToast() {
    const toast = document.getElementById('successToast');
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

$(document).ready(function () {
    //  Edit Ticket Button Click
    $(document).on("click", ".edit-ticket-action", function (e) {
        e.preventDefault();

        const grid = window.ticketGridInstance;
        if (!grid) return alert("Ticket grid not found.");

        const selected = grid.getSelectedRowsData();
        if (selected.length === 0) return alert("Please select a row to edit.");

        const data = selected[0];

        // Fill Edit Modal Fields
        $("#editComputer").val(data.Computer);
        $("#editStatus").val(data.Status);
        $("#editOwner").val(data.Owner);
        $("#editAssignedTo").val(data.AssignedTo);
        $("#editDescription").val(data.Description);
        $("#editEmail").val(data.Email);
        $("#editPriority").val(data.Priority);

        $("#editTicketModal").data("ticketId", data.ID);
        $("#modalContext").val("edit");

        // Show Modal
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("editTicketModal"));
        modal.show();
    });

    // Update Ticket Button Click
    $(document).on("click", "#updateTicketBtn", function () {
        const grid = window.ticketGridInstance;
        const ticketId = $("#editTicketModal").data("ticketId");
        if (!ticketId || !grid) return;

        // Extract Fields
        const updatedTicket = {
            Computer: $("#editComputer").val(),
            Status: $("#editStatus").val(),
            Owner: $("#editOwner").val(),
            AssignedTo: $("#editAssignedTo").val(),
            Email: $("#editEmail").val(),
            Description: $("#editDescription").val(),
            Priority: $("#editPriority").val(),
            LastModified: new Date().toISOString().split("T")[0]
        };

        // Validate Fields
        for (const key in updatedTicket) {
            if (!updatedTicket[key]) {
                alert("All fields are required.");
                return;
            }
        }

        // Update Ticket
        const dataSource = grid.option("dataSource");
        const index = dataSource.findIndex(t => t.ID === ticketId);
        if (index === -1) return;

        dataSource[index] = {
            ...dataSource[index],
            ...updatedTicket
        };

        grid.option("dataSource", dataSource);
        grid.refresh();

        // Hide Modal, Show Toast
        bootstrap.Modal.getInstance(document.getElementById("editTicketModal")).hide();
        showSuccessToast();

        // Optional: reset modalContext after update
        $("#modalContext").val("new");
    });
});
