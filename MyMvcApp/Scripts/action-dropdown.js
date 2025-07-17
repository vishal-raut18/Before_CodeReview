$(document).ready(function () {

    function updateTicketStatus(newStatus, toastId, colorClass) {
        const grid = $("#ticketGrid").dxDataGrid("instance");

        if (!grid) {
            console.warn("DataGrid not found with #ticketGrid.");
            return;
        }

        const selectedRows = grid.getSelectedRowsData();

        if (selectedRows.length === 0) {
            alert("Please select at least one ticket to update.");
            return;
        }

        // Update status of selected rows
        const dataSource = grid.option("dataSource");

        selectedRows.forEach(selected => {
            const rowIndex = dataSource.findIndex(r => r.ID === selected.ID);
            if (rowIndex !== -1) {
                dataSource[rowIndex].Status = newStatus;
            }
        });

        grid.refresh(); // Apply changes

        // Show toast
        const toastEl = document.getElementById(toastId);
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }

    // Handle status changes
    $(document).on('click', '.change-status-open', function (e) {
        e.preventDefault();
        updateTicketStatus("Open", "toastOpen", "text-success");
    });

    $(document).on('click', '.change-status-inprogress', function (e) {
        e.preventDefault();
        updateTicketStatus("In Progress", "toastProgress", "text-primary");
    });

    // Handle Done button in Close Confirmation Modal
    $(document).on('click', '#confirmCloseTicket', function () {
        const grid = $("#ticketGrid").dxDataGrid("instance");

        if (!grid) {
            console.warn("DataGrid not found.");
            return;
        }

        const selectedRows = grid.getSelectedRowsData();

        if (selectedRows.length === 0) {
            alert("Please select at least one ticket to close.");
            return;
        }

        const dataSource = grid.option("dataSource");

        selectedRows.forEach(selected => {
            const rowIndex = dataSource.findIndex(r => r.ID === selected.ID);
            if (rowIndex !== -1) {
                dataSource[rowIndex].Status = "Closed";
            }
        });

        grid.refresh(); // Apply changes
        $("#closeTicketModal").modal("hide"); // Close modal

        // ✅ Show toast
        const toastEl = document.getElementById("toastClosed");
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    });

  
});
