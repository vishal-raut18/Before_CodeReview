$(function () {
    // Handler for "Mark as Open"
    $(".change-status-open").on("click", function () {
        updateTicketStatus("Open", "ticketOpenToast", "bg-success");
    });

    // Handler for "Mark as In Progress"
    $(".change-status-inprogress").on("click", function () {
        updateTicketStatus("In Progress", "ticketInProgressToast", "bg-warning");
    });

    // Handler for "Close Ticket" button (confirm modal)
    $("#confirmCloseTicket").on("click", function () {
        updateTicketStatus("Closed", "ticketClosedToast", "bg-primary");

        $("#closeTicketModal").modal("hide");
    });
});

// Generic update function
function updateTicketStatus(newStatus, toastId, colorClass) {
    const grid = $("#ticketGrid").dxDataGrid("instance");

    if (!grid) return;

    const selectedRows = grid.getSelectedRowsData();
    if (selectedRows.length === 0) {
        alert("Please select at least one ticket.");
        return;
    }

    const ticketIds = selectedRows.map(r => r.ID);

    $.ajax({
        type: "POST",
        url: "/Ticket/UpdateTicketStatus",
        contentType: "application/json",
        data: JSON.stringify({
            ids: ticketIds,
            newStatus: newStatus
        }),
        success: function () {
            // Update UI grid
            const dataSource = grid.option("dataSource");
            ticketIds.forEach(id => {
                const index = dataSource.findIndex(item => item.ID === id);
                if (index !== -1) dataSource[index].Status = newStatus;
            });
            grid.refresh();

            // Show toast
            const toastEl = document.getElementById(toastId);
            if (toastEl) {
                const bsToast = new bootstrap.Toast(toastEl);
                bsToast.show();
            }
        },
        error: function () {
            alert("Failed to update ticket status.");
        }
    });
}
