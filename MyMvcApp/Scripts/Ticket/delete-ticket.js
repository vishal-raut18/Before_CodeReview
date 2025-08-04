$(document).ready(function () {
    console.log("Delete ticket JS loaded.");

    let selectedTicketIDs = []; // Store multiple IDs

    // When Delete Ticket action is clicked
    $(document).on("click", ".delete-ticket-action", function (e) {
        e.preventDefault();

        const grid = $("#ticketGrid").dxDataGrid("instance");
        if (!grid) {
            alert("Grid not found");
            return;
        }

        const selectedRows = grid.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("Please select at least one row to delete.");
            return;
        }

        selectedTicketIDs = selectedRows.map(row => row.TicketID); // Collect all selected IDs
        console.log("Selected TicketIDs for delete:", selectedTicketIDs);

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteTicketModal"));
        modal.show();
    });

    // When YES is clicked in Delete modal
    $("#confirmDeleteBtn").on("click", function () {
        if (!selectedTicketIDs.length) {
            alert("No tickets selected.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/Ticket/Delete",
            traditional: true, // Important for sending array properly
            data: { id: selectedTicketIDs },
            success: function (response) {
                if (response.success) {
                    // Update grid after deletion
                    const grid = $("#ticketGrid").dxDataGrid("instance");
                    if (grid) {
                        const currentData = grid.getDataSource().items();
                        const updatedData = currentData.filter(item => !selectedTicketIDs.includes(item.TicketID));
                        grid.option("dataSource", updatedData);
                        grid.refresh();
                    }

                    // Hide modal and show toast
                    bootstrap.Modal.getInstance(document.getElementById("deleteTicketModal")).hide();
                    new bootstrap.Toast(document.getElementById("deleteToast")).show();
                } else {
                    alert("Delete failed: " + (response.message || "Unknown error"));
                }
            },
            error: function (err) {
                alert("Error deleting tickets: " + err.responseText);
            }
        });
    });
});
