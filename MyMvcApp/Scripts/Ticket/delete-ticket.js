$(document).ready(function () {
    console.log("Delete ticket JS loaded.");

    let selectedTicketID = null; // global for use across functions

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
            alert("Please select a row to delete.");
            return;
        }

        selectedTicketID = selectedRows[0].TicketID; // get TicketID
        console.log("Selected TicketID for delete:", selectedTicketID);

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("deleteTicketModal"));
        modal.show();
    });

    // When YES is clicked in Delete modal
    $("#confirmDeleteBtn").on("click", function () {
        if (!selectedTicketID) {
            alert("No ticket selected.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/Ticket/Delete", // ✅ adjust if your controller is in a different route
            data: { id: selectedTicketID },
            success: function (response) {
                if (response.success) {
                    // Remove from grid
                    const grid = $("#ticketGrid").dxDataGrid("instance");
                    if (grid) {
                        const currentData = grid.getDataSource().items();
                        const updatedData = currentData.filter(item => item.TicketID !== selectedTicketID);
                        grid.option("dataSource", updatedData);
                        grid.refresh();
                    }

                    // Hide modal
                    bootstrap.Modal.getInstance(document.getElementById("deleteTicketModal")).hide();

                    // Show toast if needed
                    const toast = new bootstrap.Toast(document.getElementById("deleteToast"));
                    toast.show();
                } else {
                    alert("Delete failed: " + (response.message || "Unknown error"));
                }
            },
            error: function (err) {
                alert("Error deleting ticket: " + err.responseText);
            }
        });
    });
});
